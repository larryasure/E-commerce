import React from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/formatCurrency";
import { NavLink } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const { cart, addCart, increaseCart, decreaseCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const cartItem = cart?.items?.find((item) => item.product?.id === product.id);

  const quantity = cartItem ? cartItem.quantity : 0;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.original_price || 0);
  const rating = Number(product.rating || 0);
  const ratingCount = Number(product.rating_count || 0);

  const isLowStock = product.stock <= 5 && product.stock > 0;

  const wishlisted = isWishlisted(product.id);

  const stockStatus =
    product.stock === 0
      ? "Sold out"
      : isLowStock
        ? `${product.stock} left`
        : "In stock";

  return (
    <div className="bg-white rounded-lg h-62 w-full shadow-md overflow-hidden relative  ">
      <div className="relative h-30 w-full ">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.discount_percentage > 0 && (
          <span className="absolute text-[12px] bg-red-300 text-white px-2 py-1 rounded-md top-2 left-2">
            {`- ${product.discount_percentage}%`}
          </span>
        )}
        <span
          onClick={() => toggleWishlist(product.id)}
          className="absolute text-xs right-2 top-2 rounded-md  cursor-pointer"
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            fill={isWishlisted(product.id) ? "#ef4544" : "none"}
          />
        </span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 truncate">
          {product.name}
        </h3>
          <p className="text-xs my-1.5 text-gray-500 line-clamp-2">{product.description || "No description available."}</p>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-[#13315c] text-xs">
            {formatCurrency(price)}
          </span>


          {product.discount_percentage > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
