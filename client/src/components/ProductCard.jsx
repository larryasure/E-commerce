import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductCard({ product, index = 0, variant = "grid" }) {
  const { cart, addCart, increaseCart, decreaseCart } = useCart();
  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const baseClass =
    "group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full";

  const imageHeight = {
    grid: "h-32",
    featured: "h-32",
    compact: "h-24",
  }[variant];

  return (
    <div className={baseClass} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="relative bg-gray-100 overflow-hidden h-42">
        <div className={imageHeight}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full  object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-lg">
          <Heart size={18} className="cursor-pointer hover:text-red-500" />
        </div>

        {product.is_new && (
          <div className="absolute top-2 left-2">
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-medium">
              New
            </span>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="p-2.5 flex flex-col flex-1">
        <h3 className="font-bold text-[#13315c] group-hover:text-[#155daf] transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 uppercase mt-1">
          {product.category?.name || "Category"}
        </p>

        <p className="text-xs text-gray-600 line-clamp-2 mt-1.5">
          {product.description || "Premium product"}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[#155daf]">
              {formatCurrency(product.price)}
            </span>

            <span
              className={`text-xs font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-5">
            <NavLink
              to={`/products/${product.id}`}
              className={`px-3 text-center py-1.5 text-sm rounded-lg font-medium transition-all duration-300 ${
                product.stock > 0
                  ? "bg-[#155daf] text-white hover:bg-[#13315C] hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {variant === "featured" ? "View" : " Details"}
            </NavLink>

            {quantity > 0 ? (
              <div className="flex items-center rounded-xl  border border-sky-200 bg-sky-50 overflow-hidden">
                <button
                  onClick={() => decreaseCart(product.id)}
                  className="p-2 hover:bg-sky-100"
                >
                  <Minus size={16} />
                </button>

                <span className="px-2 text-sm font-bold">{quantity}</span>

                <button
                  onClick={() => increaseCart(product.id)}
                  className="p-2 hover:bg-sky-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addCart(product)}
                className="flex items-center gap-2 rounded-lg bg px-3 py-1.5 text-sm bg-[#155daf] text-white hover:bg-[#13315C] hover:scale-105 cursor-pointer"
              >
                <ShoppingCart size={16} />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
