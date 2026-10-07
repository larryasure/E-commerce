"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Minus, Plus, ShoppingCart, Trash2, Heart } from "lucide-react";
import Image from "next/image";

export default function WishlistPage() {
  const { token } = useAuthStore();
  const { wishlists, fetchWishlist, removeItem } = useWishlistStore();
  const { cart, addItem, increaseQuantity, decreaseQuantity } = useCartStore();

  useEffect(() => {
    if (token) {
      fetchWishlist(token);
    }
  }, [token, fetchWishlist]);

  if (!wishlists || wishlists.length === 0) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-slate-50/50">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart className="w-9 h-9 text-rose-500 fill-rose-50" />
          </div>
          <h1 className="text-2xl font-bold text-[#13315c] mb-2 tracking-tight">
            Your Wishlist is Empty
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            Explore our collection and add your favorite items here to track
            them or move them directly to your cart later.
          </p>
          <Link
            href="/products"
            className="inline-block w-full sm:w-auto bg-[#155daf] text-white px-6 py-3 rounded-xl hover:bg-[#13315C] transition-all duration-200 shadow-sm hover:shadow font-semibold text-sm tracking-wide"
          >
            Start Discovering Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto">
        {/* HEADER SECTION */}
        <div className="flex items-end justify-between border-b border-slate-200 pb-5 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#13315c] tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Save items to purchase them later or monitor pricing updates
            </p>
          </div>
          <div className="bg-slate-100 border border-slate-200/60 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 tracking-wide select-none">
            {wishlists.length} {wishlists.length === 1 ? "Item" : "Items"}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {wishlists.map((wishlistItem) => {
            const item = wishlistItem.product;

            const wishlistId = wishlistItem.id;
            const itemId = item?.id;
            const itemPrice = item?.price;

            if (
              wishlistId === undefined ||
              itemId === undefined ||
              itemPrice === undefined ||
              !item
            ) {
              return null;
            }

            const cartItem = cart?.items?.find((c) => c.product?.id === itemId);
            const quantity = cartItem?.quantity || 0;

            return (
              <div
                key={itemId}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md/50 transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="overflow-hidden h-28 w-28 sm:h-32 sm:w-32 rounded-xl shrink-0 border border-slate-100 shadow-sm bg-slate-50 relative">
                    <Link
                      href={`/products/${itemId}`}
                      className="w-full h-full block"
                    >
                      <div className="w-full h-full transition-transform duration-300 group-hover:scale-102 flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={250}
                          height={250}
                      
                      />
                      </div>
                    </Link>
                  </div>

                  <div className="flex flex-col flex-1 w-full min-h-[112px] sm:min-h-[128px]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link href={`/products/${itemId}`}>
                          <h2 className="text-[#13315c] text-base sm:text-lg font-semibold hover:text-[#155daf] transition-colors duration-150 truncate max-w-md tracking-tight">
                            {item.name}
                          </h2>
                        </Link>
                        <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                          {item.category?.name || "Uncategorized"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          {formatCurrency(itemPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100 w-full">
                      <button
                        onClick={() => removeItem(wishlistId)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors duration-150 p-1 -ml-1 rounded-lg"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                      <div className="shrink-0">
                        {quantity > 0 ? (
                          <div className="flex items-center rounded-xl border border-sky-100 bg-sky-50/30 overflow-hidden shadow-sm h-10">
                            <button
                              className="hover:bg-sky-100/70 p-2.5 transition-colors text-sky-700"
                              onClick={() =>
                                cartItem &&
                                cartItem.id !== undefined &&
                                decreaseQuantity(cartItem.id)
                              }
                            >
                              <Minus size={14} className="stroke-[2.5]" />
                            </button>
                            <span className="font-bold text-xs text-sky-950 px-2 min-w-8 text-center select-none">
                              {quantity}
                            </span>
                            <button
                              className="p-2.5 hover:bg-sky-100/70 transition-colors text-sky-700"
                              onClick={() =>
                                cartItem &&
                                cartItem.id !== undefined &&
                                increaseQuantity(cartItem.id)
                              }
                            >
                              <Plus size={14} className="stroke-[2.5]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(itemId, 1)}
                            className="flex items-center gap-2 rounded-xl bg-[#155daf] px-4 h-10 text-xs font-semibold text-white hover:bg-[#13315C] active:scale-98 transition-all duration-150 shadow-sm hover:shadow"
                          >
                            <ShoppingCart size={13} className="stroke-[2.5]" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
