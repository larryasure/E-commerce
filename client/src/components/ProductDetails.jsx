import { CornerDownLeft, Lock, Van } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import fallback from "../assets/Hero banner/Fallback.jpg";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart, addCart, increaseCart, decreaseCart } = useCart();

  const cartItem = cart?.items?.find(
    (item) => item.product?.id === product?.id,
  );

  const quantity = cartItem?.quantity || 0;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#155daf]/20 border-t-[#155daf] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#13315C] mb-3">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The product you are looking for does not exist.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#155daf] text-white px-6 py-3 rounded font-semibold hover:bg-[#13315C] transition-all duration-300"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  mt-20">
      <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-[#155daf] text-sm hover:underline"
          >
            ← Back to results
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* ── LEFT col: image + details ── */}
          <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-8 items-start">
            {/* Image */}
            <div className="flex flex-col gap-3">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white flex items-center justify-center aspect-square">
                <img
                  src={product.image || fallback}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center text-xs text-gray-400">
                Roll over image to zoom in
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#155daf] font-semibold uppercase tracking-widest">
                {product.category?.name || "Premium Collection"}
              </p>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <span className="text-yellow-400 text-sm leading-none">
                  ★★★★★
                </span>
                <span className="text-sm text-[#155daf] hover:underline cursor-pointer">
                  124 ratings
                </span>
              </div>

              <div className="pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 mb-0.5">Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  FREE delivery on orders above ₦150,000
                </p>
              </div>

              <p
                className={`text-base font-semibold ${product.stock > 0 ? "text-[#007600]" : "text-red-600"}`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>

              <div className="pb-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  About this item
                </p>
                <p className="text-sm text-gray-600 leading-7">
                  {product.description ||
                    "Crafted with premium materials and designed for exceptional durability, comfort, and everyday performance. Built for people who appreciate quality and style in every detail."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: <Van size={16} />,
                    text: "Nationwide delivery available",
                  },
                  {
                    icon: <Lock size={16} />,
                    text: "Secure & protected checkout",
                  },
                  {
                    icon: <CornerDownLeft size={16} />,
                    text: "30-day hassle-free returns",
                  },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="text-[#155daf] shrink-0">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="lg:sticky lg:top-6">
              <div className="border border-gray-200 bg-white/80  rounded-lg p-6 flex flex-col gap-4">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </p>

                <p className="text-sm text-gray-600">
                  FREE delivery on orders above{" "}
                  <span className="font-semibold text-gray-900">₦150,000</span>
                </p>

                <p className="text-base font-semibold text-[#007600]">
                  In Stock
                </p>

                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 font-medium ">
                    Qty:
                  </label>
                  <div className="flex items-center border border-gray-300  rounded-xl">
                    <button
                      onClick={() => decreaseCart(cartItem.id)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none border-r border-gray-300 active:scale-110 hover:rounded-xs"
                    >
                      −
                    </button>
                    <span className="px-4 py-1.5 font-semibold text-gray-900 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => increaseCart(cartItem.id)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors text-lg leading-none border-l border-gray-300 active:scale-110 hover:rounded-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addCart(product.id)}
                  className="w-full bg-[#155daf] hover:bg-[#13315C] text-white py-2.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm"
                >
                  {quantity > 0 ? "✓ Added to Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full bg-[#13315C] hover:bg-[#0d2240] text-white py-2.5 rounded-full font-semibold text-sm transition-all duration-200"
                >
                  Go to Cart
                </button>

                <div className="flex items-center flex-col justify-center gap-1.5 text-xs text-gray-400 pt-1">
                  <Lock size={11} />
                  Secure transaction
                  <span className="text-gray-700 ">30-day return policy</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
