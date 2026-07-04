import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import fallback from "../assets/Hero banner/Fallback.jpg";
import { formatCurrency } from "../utils/formatCurrency";

import { CornerDownLeft, Lock, Van } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to load product", error);
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
        image: product.image,
        price: product.price,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#155daf]/20 border-t-[#155daf] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#13315C] mb-3">
            Product Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            The product you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-[#155daf] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#13315C] transition-all duration-300"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-[#155daf] font-semibold hover:text-[#13315C] transition-all duration-300 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg">
              <img
                src={product.image || fallback}
                alt={product.name}
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute top-5 right-5 bg-[#13315C] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              Premium
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fadeInUp">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#155daf] mb-3">
                {product.category?.name || "Premium Collection"}
              </p>

              <h1 className="text-3xl sm:text-4xl font-black text-[#13315C] leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-5">
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  ★★★★★
                </div>

                <span className="text-sm text-gray-500">
                  124 Verified Reviews
                </span>

                <span
                  className={`text-sm font-semibold px-4 py-1 rounded-full ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-linear-to-r from-[#13315C] to-[#155daf] rounded-3xl p-7 text-white shadow-xl">
              <p className="uppercase tracking-widest text-sm opacity-80 mb-2">
                Price
              </p>

              <h2 className="text-4xl font-black">
                {formatCurrency(product.price)}
              </h2>

              <p className="mt-3 text-sm text-white/80">
                Free shipping on orders above ₦150,000
              </p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <h3 className="text-xl font-bold text-[#13315C] mb-4">
                Product Details
              </h3>

              <p className="text-gray-600 leading-8 text-[15px] max-w-2xl">
                {product.description ||
                  "Crafted with premium materials and designed for exceptional durability, comfort, and everyday performance. Built for people who appreciate quality and style in every detail."}
              </p>
            </div>

            {product.stock > 0 && (
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-7 space-y-6">
                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#13315C] text-lg">
                    Quantity
                  </label>

                  <div className="flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-5 py-3 text-lg hover:bg-gray-100 transition-colors duration-300"
                    >
                      −
                    </button>

                    <span className="px-6 font-bold text-[#13315C]">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-5 py-3 text-lg hover:bg-gray-100 transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#155daf] hover:bg-[#13315C] text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
                >
                  {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                </button>

                {/* Go To Cart */}
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full border-2 border-[#155daf] text-[#155daf] py-4 rounded-2xl font-bold text-lg hover:bg-[#155daf] hover:text-white transition-all duration-300"
                >
                  Go to Cart
                </button>
              </div>
            )}

            {/* Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm flex items-center flex-col">
                <p className="text-2xl mb-2">
                  <Van />
                </p>

                <h4 className="font-bold text-[#13315C] text-sm">
                  Fast Delivery
                </h4>

                <p className="text-xs text-gray-500 mt-1">
                  Nationwide shipping
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm  flex items-center flex-col">
                <p className="text-2xl mb-2 ">
                  <Lock />
                </p>

                <h4 className="font-bold text-[#13315C] text-sm">
                  Secure Payment
                </h4>

                <p className="text-xs text-gray-500 mt-1">
                  100% protected checkout
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm flex items-center flex-col">
                <p className="text-2xl mb-2">
                  <CornerDownLeft />
                </p>

                <h4 className="font-bold text-[#13315C] text-sm">
                  Easy Returns
                </h4>

                <p className="text-xs text-gray-500 mt-1">30-day guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
