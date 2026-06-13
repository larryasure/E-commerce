import { NavLink } from "react-router-dom";

export default function ProductCard({ product, index, variant = "default" }) {
  const baseClass =
    "group bg-white rounded-xl shadow-lg hover:rounded-2xl transition-all animate-fadeInUp duration-300";

  const imageHeight = {
    height: "h-48",
    line: "h-56",
    featured: "h-48",
  }[variant];

  return (
    <>
      <div className={baseClass} style={{ animationDelay: `${index * 100}ms` }}>
        <div className="relative bg-gray-100 overflow-hidden ">
          \
          <div className={imageHeight}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full group:scale-110 transition-transform object-cover duration-300 "
            />
          </div>
          <div className="absolute flex flex-col right-4 top-4 gap-2">
            {product.price && (
              <p className="bg-[#155daf] text-white font-semibold py-1 px-3 rounded-xl  text-sm"></p>
            )}

            {product.stock !== undefined && (
              <div className="bg-orange-500 text-white font-semibold py-1 px-3 rounded-xl text-sm ">
                Low stock
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-lg font-bold text-white ">
                  Out of stock
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <p className="text-[#155daf] font-medium mb-2 text-sm ">
            {product.category?.name || "Category"}
          </p>

          <h3 className="text-lg font-bold mb-2 clamp-2 text-[#13315c]">
            {product.name}
          </h3>

          <p className="mb-4 text-sm line-clamp-2 text-gray-600 ">
            {product.description || "Premium product"}
          </p>

          <div className="flex items-center justify-between mb-4">
            {product.price && (
              <span className="text-2xl font-bold text-[#155daf] ">
                {product.price}
              </span>
            )}

            {product.stock !== undefined && (
              <span
                className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
              >
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </span>
            )}
          </div>

          <NavLink
            to={`products/${product.id}`}
            className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-300 ${
              product.stock > 0
                ? "bg-[#155daf] text-white hover:bg-[#13315C] transform hover:scale-105 active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={(e) => product.stock === 0 && e.preventDefault()}
          >
            {variant === "featured" ? "View" : "View details"}
          </NavLink>
        </div>
      </div>
    </>
  );
}
