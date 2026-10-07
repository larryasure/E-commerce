"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

import { ProductSerializer } from "@/lib/types/api";
import { useCartStore } from "@/lib/stores/cartStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface ProductCardProps {
  product: ProductSerializer;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const router = useRouter();

  const {
    cart,
    addItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const { token } = useAuthStore();

  const { isWishlisted, toggleWishlist } = useWishlistStore();

  const cartItem = cart?.items?.find(
    (item) => item.product?.id === product.id,
  );

  const quantity = cartItem?.quantity ?? 0;
  const wishlisted = isWishlisted(product.id);

  const isDiscounted = product.discount_percentage > 0;
  const isSoldOut = product.stock === 0;

  const handleAddToCart = async () => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (product.id === undefined) return;

    await addItem(product.id, 1);
  };

  const handleIncrease = async () => {
    if (!cartItem?.id) return;

    await increaseQuantity(cartItem.id);
  };

  const handleDecrease = async () => {
    if (!cartItem?.id) return;

    await decreaseQuantity(cartItem.id);
  };

  const handleWishlist = async () => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (product.id === undefined) return;

    await toggleWishlist(product.id);
  };

  return (
    <article className={`group relative flex h-[52vh] min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-sm ${isSoldOut ? "cursor-not-allowed" : ""}`
} >

      {/* IMAGE */}
      <div className="relative aspect-3.5/2.5 w-full overflow-hidden bg-gray-50">

        <Link
          href={`/products/${product.id}`}
          className="block h-full w-full"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading="lazy"
              sizes="(max-width: 400px) 30vw, (max-width: 600px) 14vw, 15vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </Link>

        {/* DISCOUNT */}
        {isDiscounted && (
          <span className="absolute left-2 top-2 rounded bg-[#13315c] px-2 py-1 text-[11px] font-bold text-white">
            -{product.discount_percentage}%
          </span>
        )}

        {/* WISHLIST */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          <Heart
            size={17}
            strokeWidth={2}
            className={
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }
          />
        </button>

        {/* SOLD OUT */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 ">
            <span className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-gray-800">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-3">

        {/* CATEGORY */}
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          {product.category?.name || "Uncategorized"}
        </p>

        {/* NAME */}
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2  text-sm font-medium text-gray-900 transition-colors hover:text-[#13315c]">
            {product.name}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <span className="text-[11px] inline-flex font-bold text-[#13315c]">
            {formatCurrency(product.price)}
          </span>

          {isDiscounted && (
            <span className="text-[11.5px] text-gray-400 line-through">
              {formatCurrency(product.original_price || 0)}
            </span>
          )}
        </div>

        {/* ACTION */}
        <div className="mt-3">
          {!isSoldOut ? (
            quantity > 0 ? (
              <div className="flex h-9 items-center rounded-md border border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="flex h-full w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <Minus size={15} />
                </button>

                <span className="flex-1 text-center text-sm font-semibold text-gray-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="flex h-full w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <Plus size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex py-1.5 w-full items-center justify-center gap-2 rounded-md bg-[#13315c] text-xs font-semibold text-white  hover:bg-[#0f274a]  transition-all active:scale-[0.98]"
              >
                <ShoppingCart size={15} />
                Add to cart
              </button>
            )
          ) : (
            <div className="flex h-9 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-400">
              Sold out
            </div>
          )}
        </div>
      </div>
    </article>
  );
}