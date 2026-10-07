"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function CartPage() {
  const { token } = useAuthStore();

  const { cart, fetchCart, increaseQuantity, decreaseQuantity, removeItem } =
    useCartStore();

  useEffect(() => {
    if (token) {
      fetchCart(token);
    }
  }, [token, fetchCart]);

  const items = cart?.items ?? [];

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <ShoppingBag size={28} className="text-[#155daf]" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#13315C]">
              Sign in to view your cart
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Sign in to access the items you have added to your Prime Park
              shopping cart.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#155daf] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#13315C]"
              >
                Sign in
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-[#13315C] transition-colors hover:border-[#155daf] hover:text-[#155daf]"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!cart) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <CartSkeleton />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-[#155daf]">
              Your shopping bag
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#13315C] sm:text-3xl">
              Shopping Cart
            </h1>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f5fb]">
              <ShoppingBag
                size={34}
                strokeWidth={1.7}
                className="text-[#155daf]"
              />
            </div>

            <h2 className="mt-6 text-xl font-bold text-[#13315C]">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven&apos;t added anything to your cart yet. Explore our
              products and find something you&apos;ll love.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#155daf] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#13315C]"
            >
              Start shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <div className="mb-7">
          <Link
            href="/products"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-[#155daf]"
          >
            <ChevronLeft size={16} />
            Continue shopping
          </Link>

          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#155daf]">
                Your shopping bag
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#13315C] sm:text-3xl">
                Shopping Cart
              </h1>
            </div>

            <p className="text-sm text-gray-500">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start lg:gap-8">
          <section className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Desktop heading */}
              <div className="hidden border-b border-gray-200 px-6 py-4 sm:flex sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#13315C]">
                    Cart items
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Review your items before checkout.
                  </p>
                </div>

                <ShoppingBag size={19} className="text-gray-400" />
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const price = item.product?.price ?? 0;
                  const quantity = item.quantity ?? 0;
                  const itemTotal = price * quantity;

                  return (
                    <div key={item.id} className="p-4 sm:p-6">
                      <div className="flex gap-4">
                        {/* Product placeholder */}
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-[#f6f8fb] sm:h-24 sm:w-24">
                          <ShoppingBag
                            size={27}
                            strokeWidth={1.5}
                            className="text-gray-300"
                          />
                        </div>

                        {/* Product information */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[#13315C] sm:text-base">
                                {item.product?.name || "Product"}
                              </h3>

                              <p className="mt-1 text-xs text-gray-500">
                                Prime Park product
                              </p>
                            </div>

                            {/* Mobile remove */}
                            <button
                              type="button"
                              onClick={() => {
                                if (item.id !== undefined) {
                                  removeItem(item.id);
                                }
                              }}
                              aria-label={`Remove ${
                                item.product?.name || "product"
                              }`}
                              className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:hidden"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="mt-3 text-sm font-bold text-[#155daf]">
                            {formatCurrency(price)}
                          </p>

                          {/* Quantity + total */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center rounded-md border border-gray-300">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.id !== undefined) {
                                    decreaseQuantity(item.id);
                                  }
                                }}
                                aria-label="Decrease quantity"
                                className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#155daf]"
                              >
                                <Minus size={15} />
                              </button>

                              <span className="flex h-9 min-w-[38px] items-center justify-center border-x border-gray-300 px-2 text-sm font-bold text-[#13315C]">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  if (item.id !== undefined) {
                                    increaseQuantity(item.id);
                                  }
                                }}
                                aria-label="Increase quantity"
                                className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#155daf]"
                              >
                                <Plus size={15} />
                              </button>
                            </div>

                            <div className="flex items-center gap-5">
                              <p className="text-sm font-bold text-[#13315C]">
                                {formatCurrency(itemTotal)}
                              </p>

                              {/* Desktop remove */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.id !== undefined) {
                                    removeItem(item.id);
                                  }
                                }}
                                aria-label={`Remove ${
                                  item.product?.name || "product"
                                }`}
                                className="hidden items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors hover:text-red-600 sm:flex"
                              >
                                <Trash2 size={15} />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery information */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#155daf]">
                    <Truck size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#13315C]">
                      Reliable delivery
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your order will be prepared and delivered after checkout.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#155daf]">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#13315C]">
                      Secure checkout
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your payment is handled securely during checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24">
              <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                <h2 className="text-lg font-bold text-[#13315C]">
                  Order Summary
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Review your order total before checkout.
                </p>
              </div>

              <div className="space-y-4 px-5 py-5 sm:px-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-600">Subtotal</span>

                  <span className="font-semibold text-[#13315C]">
                    {formatCurrency(cart.subtotal || 0)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-600">Shipping</span>

                  <span
                    className={
                      (cart.shipping ?? 0) === 0
                        ? "font-semibold text-green-600"
                        : "font-semibold text-[#13315C]"
                    }
                  >
                    {(cart.shipping ?? 0) === 0
                      ? "Free"
                      : formatCurrency(cart.shipping || 0)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-[#13315C]">Total</span>

                    <span className="text-xl font-extrabold text-[#155daf]">
                      {formatCurrency(cart.grand_total || 0)}
                    </span>
                  </div>
                </div>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#155daf] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#13315C]"
                >
                  Proceed to Checkout
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/products"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#13315C] transition-colors hover:border-[#155daf] hover:text-[#155daf]"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Checkout reassurance */}
              <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
                <div className="flex items-start gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-green-600" />

                  <p className="text-xs leading-5 text-gray-500">
                    You can review your shipping details and payment information
                    before placing your order.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-7">
        <div className="h-4 w-32 rounded bg-gray-200" />

        <div className="mt-3 h-8 w-48 rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="h-5 w-28 rounded bg-gray-200" />
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 border-b border-gray-200 p-5 last:border-0"
            >
              <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-200 sm:h-24 sm:w-24" />

              <div className="flex-1">
                <div className="h-4 w-3/4 rounded bg-gray-200" />

                <div className="mt-3 h-3 w-24 rounded bg-gray-100" />

                <div className="mt-5 h-9 w-28 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="h-6 w-36 rounded bg-gray-200" />

          <div className="mt-8 space-y-5">
            <div className="flex justify-between">
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>

            <div className="flex justify-between">
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>

            <div className="border-t border-gray-200 pt-5">
              <div className="flex justify-between">
                <div className="h-5 w-16 rounded bg-gray-200" />
                <div className="h-6 w-28 rounded bg-gray-200" />
              </div>
            </div>

            <div className="h-12 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
