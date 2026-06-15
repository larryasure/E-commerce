import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import fallback from "../assets/Hero banner/Fallback.jpg";
import { AuthContext } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const {isAuthenticated} = useContext(AuthContext)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to load product ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex item-center justify-center  min-h-[50vh] ">
        <div className="w-12 h-12 border border-b-3 rounded-full animate-spin border-[#155daf]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <div className="text-gray-600 text-lg ">Product not Found</div>
      </div>
    );
  }

  return (
    <>
      <div className="py-12 min-h-screen">
        <div className="max-auto px-4 md:px-6 lg:px-8 max-w-6xl w-full  ">
          <button
            onClick={() => navigate(-1)}
            className="text-[#155daf] cursor-pointer hover:text-[#13315c] transition-all duration-200 mb-8 font-semibold"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 rounded-xl w-full overflow-hidden">
                <img
                  src={product.image || fallback}
                  alt={product.name}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="space-y-2 animate-fadeInUp">
              <div>
                <p className="text-sm text-[#155daf] font-medium mb-2 uppercase tracking-wide">
                  {product.category.name}
                </p>
                <h1 className="text-4xl font-bold text-[#13315C] mb-4">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="bg-[#155daf]/10 rounded-lg p-6">
                <p className="text-gray-600 text-sm mb-2">Price</p>
                <p className="text-4xl font-bold text-[#155daf]">
                  {formatCurrency(product.price)}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-[#13315C] mb-4">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Premium quality product"}
                </p>
              </div>

              {/* Stock Status */}
              <div>
                <p
                  className={`text-lg font-semibold ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
              </div>

              {/* Quantity & Add to Cart */}
              {product.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-semibold text-[#13315C]">
                      Quantity:
                    </label>
                    <div className="flex items-center border-2 border-[#155daf] rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-[#155daf]/10 transition-colors duration-300"
                      >
                        −
                      </button>
                      <span className="px-6 py-2 font-bold text-[#13315C]">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="px-4 py-2 hover:bg-[#155daf]/10 transition-colors duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#155daf] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#13315C] transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                  </button>
                </div>
              )}

              {/* Checkout CTA */}
              {product.stock > 0 && (
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full border-2 border-[#155daf] text-[#155daf] py-4 rounded-lg font-bold text-lg hover:bg-[#155daf] hover:text-white transition-all duration-300"
                >
                  Go to Cart
                </button>
              )}

              {/* Info */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm text-gray-600">
                <p>✓ Free shipping on orders over #150,000</p>
                <p>✓ 30-day return guarantee</p>
                <p>✓ Secure payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
