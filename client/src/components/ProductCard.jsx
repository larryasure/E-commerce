import { NavLink, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";


export default function ProductCard({ product, index, variant = "default" }) {
  const navigate = useNavigate()

  
  const baseClass =
    "group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all animate-fadeInUp duration-300 flex flex-col h-full";

  const imageHeight = {
    default: "h-48",
    list: "h-56",
    featured: "h-48",
  }[variant];

  return (
    <div className={baseClass} style={{ animationDelay: `${index * 100}ms` }}>
      {/* Image Section */}
      <div className="relative bg-gray-100 overflow-hidden">
        <div className={imageHeight}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {product.price && (
            <p className="bg-[#155daf] text-white tracking-wide font-semibold py-0.5 px-2 rounded-lg text-xs shadow">
              {formatCurrency(product.price)}
            </p>
          )}

          {product.stock > 0 && product.stock <= 3 && (
            <div className="bg-orange-500 text-white font-semibold py-1 px-3 rounded-xl text-sm animate-pulse">
              Low stock
            </div>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-[#155daf] font-medium mb-2 text-sm">
          {product.category?.name || "Category"}
        </p>

        <h3 className="text-lg font-bold mb-2 line-clamp-2 text-[#13315c]">
          {product.name}
        </h3>

        <p className="mb-4 text-sm line-clamp-2 text-gray-600">
          {product.description || "Premium product"}
        </p>

        {/* Bottom Section */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            {product.price && (
              <span className="text-xl font-bold text-[#155daf] tracking-wide">
                {formatCurrency(product.price)}
              </span>
            )}

            {product.stock !== undefined && (
              <span
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-7">

          <NavLink
            to={`/products/${product.id}`}
            className={`block w-full text-center py-2 rounded-lg font-semibold transition-all duration-300 ${
              product.stock > 0
              ? "bg-[#155daf] text-white hover:bg-[#13315C] hover:scale-105 active:scale-95"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={(e) => product.stock === 0 && e.preventDefault()}
          >
            {variant === "featured" ? "View Product" : "View Details"}
          </NavLink>

            <button onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-[#155daf] hover:bg-[#13315c] transition-all duration-300 rounded-lg cursor-pointer text-white font-medium">Go to cart</button>
            </div>
        </div>
      </div>
    </div>
  );
}
