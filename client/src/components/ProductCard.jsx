import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductCard({ product, index = 0 }) {
  const { cart, addCart, increaseCart, decreaseCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const cartItem = cart?.items?.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.original_price || 0);
  const rating = Number(product.rating || 0);
  const ratingCount = Number(product.rating_count || 0);

  const hasDiscount = originalPrice > price && originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const wishlisted = isWishlisted(product.id);
  const stockStatus = product.stock === 0 ? "Sold out" : isLowStock ? `${product.stock} left` : "In stock";

  return (
    <article
      className="group relative mx-auto w-full max-w-[290px] animate-fadeInUp"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#f7f8fa] p-3 shadow-[0_18px_35px_rgba(19,49,92,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(19,49,92,0.14)]">
        <div className="relative overflow-hidden rounded-[20px] bg-white">
          <div className="relative h-[220px] overflow-hidden bg-[#f4f6f8]">
            <NavLink
              to={`/products/${product.id}`}
              className="flex h-full w-full items-center justify-center p-4"
            >
              <img
                src={product.image || "/placeholder-product.png"}
                alt={product.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </NavLink>

            {hasDiscount && (
              <span className="absolute left-3 top-3 rounded-md bg-[#13315c] px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white">
                -{discountPercent}%
              </span>
            )}

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-300"
            >
              <Heart
                size={15}
                strokeWidth={1.8}
                className={wishlisted ? "fill-red-500 text-red-500" : "text-slate-600"}
              />
            </button>

            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-1 pb-1 pt-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {product.category?.name || "Sneakers"}
            </span>
            <span
              className={`text-[9px] font-semibold uppercase tracking-[0.08em] ${
                product.stock === 0 ? "text-red-500" : "text-emerald-600"
              }`}
            >
              {stockStatus}
            </span>
          </div>

          <NavLink to={`/products/${product.id}`} className="block">
            <h3 className="min-h-[52px] text-[15px] font-bold leading-[1.4] text-[#1d2a39] transition-colors duration-200 hover:text-[#155daf]">
              {product.name}
            </h3>
          </NavLink>

          {rating > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.round(rating)
                        ? "fill-[#f4b740] text-[#f4b740]"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              {ratingCount > 0 && (
                <span className="text-[11px] font-medium text-slate-500">
                  ({ratingCount})
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-extrabold tracking-tight text-[#13315c]">
                {formatCurrency(price)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] font-medium text-slate-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {quantity > 0 ? (
              <div className="flex h-11 w-full items-center justify-between overflow-hidden rounded-[12px] bg-[#13315c]">
                <button
                  type="button"
                  onClick={() => decreaseCart(cartItem.id)}
                  className="flex h-full w-12 items-center justify-center text-white transition-colors hover:bg-[#155daf]"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="text-sm font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => increaseCart(cartItem.id)}
                  className="flex h-full w-12 items-center justify-center text-white transition-colors hover:bg-[#155daf]"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addCart(product.id)}
                disabled={product.stock === 0}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#13315c] text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#155daf] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <ShoppingCart size={15} strokeWidth={2} />
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}