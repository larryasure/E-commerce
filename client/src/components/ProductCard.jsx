import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductCard({ product, index = 0 }) {
  const { cart, addCart, increaseCart, decreaseCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const cartItem = cart?.items?.find(
    (item) => item.product.id === product.id
  );

  const quantity = cartItem?.quantity || 0;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.original_price || 0);

  const hasDiscount = originalPrice > price && originalPrice > 0;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const wishlisted = isWishlisted(product.id);

  return (
    <article
      className="group relative w-full max-w-[280px] mx-auto"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(19,49,92,0.10)]">

        {/* IMAGE */}
        <div className="relative h-[175px] overflow-hidden bg-[#f7f9fc]">
          <NavLink
            to={`/products/${product.id}`}
            className="flex h-full w-full items-center justify-center p-5"
          >
            <img
              src={product.image || "/placeholder-product.png"}
              alt={product.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          </NavLink>

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-[#13315c] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white">
              -{discountPercent}%
            </span>
          )}

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition-transform duration-200 hover:scale-105"
          >
            <Heart
              size={15}
              strokeWidth={1.8}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-slate-500"}
            />
          </button>

          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="rounded-full bg-[#13315c] px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="px-4 pb-4 pt-3">

          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {product.category?.name || "General"}
            </span>

            {product.stock > 0 && (
              <span
                className={`shrink-0 text-[8px] font-semibold uppercase tracking-wide ${
                  isLowStock ? "text-amber-600" : "text-emerald-600"
                }`}
              >
                {isLowStock ? `${product.stock} left` : "In stock"}
              </span>
            )}
          </div>

          <p className="text-xs line-clamp-2 my-2 tracking-wide text-gray-600">{ product.description}</p>

          <NavLink to={`/products/${product.id}`}>
            <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-[1.4] text-[#18212f] transition-colors duration-200 group-hover:text-[#155daf]">
              {product.name}
            </h3>
          </NavLink>

          {Number(product.rating) > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-[1px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    strokeWidth={1.5}
                    className={
                      i < Math.round(Number(product.rating))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }
                  />
                ))}
              </div>

              {Number(product.rating_count) > 0 && (
                <span className="text-[9px] text-slate-400">
                  ({product.rating_count})
                </span>
              )}
            </div>
          )}

          {/* PRICE */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="text-[17px] font-extrabold tracking-tight text-[#13315c]">
                {formatCurrency(price)}
              </span>

              {hasDiscount && (
                <span className="text-[10px] font-medium text-slate-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>

            {hasDiscount && (
              <span className="shrink-0 text-[9px] font-bold text-emerald-600">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* CART */}
          <div className="mt-3">
            {quantity > 0 ? (
              <div className="flex h-9 items-center justify-between overflow-hidden rounded-xl bg-[#13315c]">
                <button
                  type="button"
                  onClick={() => decreaseCart(cartItem.id)}
                  className="flex h-full w-11 items-center justify-center text-white transition-colors hover:bg-[#155daf]"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>

                <span className="text-xs font-bold text-white">{quantity}</span>

                <button
                  type="button"
                  onClick={() => increaseCart(cartItem.id)}
                  className="flex h-full w-11 items-center justify-center text-white transition-colors hover:bg-[#155daf]"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addCart(product.id)}
                disabled={product.stock === 0}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#13315c] text-[9px] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#155daf] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <ShoppingCart size={13} strokeWidth={2} />
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}