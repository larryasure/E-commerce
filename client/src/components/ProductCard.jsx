import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  StarHalf,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductCard({ product }) {
  const { cart, addCart, increaseCart, decreaseCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const cartItem = cart?.items?.find(
    (item) => item.product?.id === product.id,
  );

  const quantity = cartItem?.quantity || 0;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.original_price || 0);
  const rating = Number(product.rating || 0);
  const ratingCount = Number(product.rating_count || 0);

  const isDiscounted = product.discount_percentage > 0;
  const isSoldOut = product.stock === 0;
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl ">
      
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
        <NavLink
          to={`/products/${product.id}`}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </NavLink>

        {isDiscounted && (
          <span className="absolute left-1 top-1 rounded-md tracking-wider bg-linear-to-br from-[#13315c] to-[#0f2337] px-1 py-0.5 text-xs font-bold text-white shadow-lg">
            -{product.discount_percentage}%
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={
            wishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            size={16}
            strokeWidth={2}
            fill={wishlisted ? "#ef4444" : "none"}
            className={`transition-colors ${
              wishlisted ? "text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="text-xl font-bold text-white">SOLD OUT</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            {product.category?.name || "Uncategorized"}
          </p>

          <NavLink to={`/products/${product.id}`}>
            <h3 className="line-clamp-2 text-base font-semibold leading-tight text-[#13315c] hover:text-[#155daf] transition-colors">
              {product.name}
            </h3>
          </NavLink>

          {rating > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const starValue = index + 1;

                  if (rating >= starValue) {
                    return (
                      <Star
                        key={index}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    );
                  }

                  if (rating >= starValue - 0.5) {
                    return (
                      <StarHalf
                        key={index}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    );
                  }

                  return (
                    <Star
                      key={index}
                      size={16}
                      className="text-gray-300"
                    />
                  );
                })}
              </div>

              {ratingCount > 0 && (
                <span className="text-xs text-gray-600 font-medium">
                  ({ratingCount})
                </span>
              )}
            </div>
          )}
        </div>

          <div className="flex justify-between items-center ">
            <span className=" font-semibold text-[#13315c]">
              {formatCurrency(price)}
            </span>

            {isDiscounted && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          {isDiscounted && originalPrice > price && (
            <p className="text-xs font-semibold text-green-600">
              Save {formatCurrency(originalPrice - price)} ({product.discount_percentage}%)
            </p>
          )}

          {/* Stock Status */}
          {!isSoldOut ? (
            <p className="text-xs font-semibold text-green-600 mt-2">
              ✓ In stock
            </p>
          ) : (
            <p className="text-xs font-bold uppercase text-red-500 mt-2">
              Sold out
            </p>
          )}

        {/* Action Button Section - Stays at Bottom */}
        <div className="mt-auto">
          {quantity > 0 ? (
            <div className="flex h-11 w-full items-center overflow-hidden rounded-lg border-2 border-[#13315c]/20 bg-[#13315c]/5">
              <button
                type="button"
                onClick={() => decreaseCart(cartItem.id)}
                className="flex h-full w-11 flex-shrink-0 items-center justify-center text-[#13315c] font-bold hover:bg-[#13315c]/10 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={18} strokeWidth={3} />
              </button>

              <span className="flex-1 text-center text-base font-bold text-[#13315c]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => increaseCart(cartItem.id)}
                className="flex h-full w-11 flex-shrink-0 items-center justify-center text-[#13315c] font-bold hover:bg-[#13315c]/10 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addCart(product.id)}
              disabled={isSoldOut}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#13315c] to-[#155daf] text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:from-[#155daf] hover:to-[#1066c4] disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 active:scale-95"
            >
              <ShoppingCart size={18} />
              {isSoldOut ? "Sold out" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}