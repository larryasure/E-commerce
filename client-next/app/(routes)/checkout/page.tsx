"use client";

import { axiosInstance } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { OrderSerializer } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { user, token } = useAuthStore();

  const { cart, fetchCart } = useCartStore();

  const [formData, setFormData] = useState(() => ({
    shippingAddress: user?.profile?.address ?? "",
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCart(token);
    }
  }, [token, fetchCart]);

  useEffect(() => {
    if (user?.profile?.address && !formData.shippingAddress.trim()) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: user.profile.address ?? "",
      }));
    }
  }, [user, formData.shippingAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: "",
      }));
    }
  };

  const handleValidate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = "Shipping address is required.";
    } else if (formData.shippingAddress.trim().length < 10) {
      newErrors.shippingAddress = "Please enter a complete shipping address.";
    }

    if (!token) {
      newErrors.submit = "Please sign in before proceeding to checkout.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!handleValidate() || !token) {
      return;
    }

    setCheckoutLoading(true);

    setErrors((prev) => ({
      ...prev,
      submit: "",
    }));

    try {
      const orderResponse = await axiosInstance.post<OrderSerializer>(
        "/orders/",
        {
          shipping_address: formData.shippingAddress.trim(),
        },
      );

      const order = orderResponse.data;

      const orderNumber = order.order_number;

      if (!orderNumber) {
        throw new Error(
          "The order was created, but no order number was returned.",
        );
      }

      const paymentResponse = await axiosInstance.post<{
        payment_link?: string;
      }>("/payments/initialize/", {
        order_number: orderNumber,
      });

      const paymentLink = paymentResponse.data.payment_link;

      if (!paymentLink) {
        throw new Error(
          "Payment initialization returned an empty payment link.",
        );
      }

      window.location.href = paymentLink;
    } catch (error: any) {
      console.error("CHECKOUT ERROR:", error?.response?.data || error);

      const responseData = error?.response?.data;

      let serverError =
        responseData?.error ||
        responseData?.message ||
        responseData?.detail ||
        error?.message ||
        "We couldn't start your checkout. Please try again.";

      if (typeof serverError === "object" && serverError !== null) {
        const firstError = Object.values(serverError)[0] as unknown;

        if (Array.isArray(firstError)) {
          serverError = firstError[0] || "Please check your checkout details.";
        } else if (typeof firstError === "string") {
          serverError = firstError;
        } else {
          serverError = "Please check your checkout details.";
        }
      }

      setErrors({
        submit:
          typeof serverError === "string"
            ? serverError
            : "We couldn't start your checkout. Please try again.",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!cart) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <CheckoutSkeleton />
        </div>
      </main>
    );
  }

  if (!cart.items?.length) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f5fb]">
              <ShoppingBag
                size={34}
                strokeWidth={1.7}
                className="text-[#155daf]"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#13315C]">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              There are no products to check out right now. Add something to
              your cart before continuing.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#155daf] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#13315C]"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const cartItems = cart.items || [];

  const subtotal = cart.subtotal || 0;

  const shipping = cart.shipping || 0;

  const grandTotal = cart.grand_total || 0;

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-[#155daf]"
          >
            <ArrowLeft size={16} />
            Back to cart
          </Link>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#155daf]">
              Secure checkout
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#13315C] sm:text-3xl">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Confirm your delivery details and review your order before
              payment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start lg:gap-8">
          <div className="space-y-5 lg:col-span-2">
            {/* Delivery details */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#155daf]">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#13315C]">
                      Delivery details
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                <label
                  htmlFor="shippingAddress"
                  className="block text-sm font-semibold text-[#13315C]"
                >
                  Shipping address
                </label>

                <p className="mt-1 text-xs text-gray-500">
                  Enter your full delivery address, including any useful
                  landmarks or delivery instructions.
                </p>

                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows={5}
                  disabled={checkoutLoading}
                  placeholder="Enter your complete shipping address"
                  className={`mt-3 w-full resize-none rounded-md border bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                    errors.shippingAddress
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 focus:border-[#155daf] focus:ring-2 focus:ring-blue-100"
                  }`}
                />

                {errors.shippingAddress && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.shippingAddress}
                  </p>
                )}

                {/* Account information */}
                {user && (
                  <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Ordering as
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#13315C]">
                      {user.email}
                    </p>
                  </div>
                )}

                {/* Submit error */}
                {errors.submit && (
                  <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium leading-5 text-red-700">
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Mobile checkout button */}
                <div className="mt-6 lg:hidden">
                  <button
                    type="submit"
                    disabled={checkoutLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#155daf] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#13315C] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {checkoutLoading ? (
                      <>
                        <Spinner />
                        Preparing payment...
                      </>
                    ) : (
                      <>
                        Continue to Payment
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Order items */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-[#13315C]">
                      Order items
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {cartItems.length}{" "}
                      {cartItems.length === 1 ? "item" : "items"} in this order.
                    </p>
                  </div>

                  <Link
                    href="/cart"
                    className="text-xs font-semibold text-[#155daf] hover:underline"
                  >
                    Edit cart
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const price = item.product?.price ?? 0;

                  const quantity = item.quantity ?? 0;

                  const total = price * quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-[#f6f8fb]">
                          <ShoppingBag
                            size={19}
                            strokeWidth={1.6}
                            className="text-gray-300"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold text-[#13315C]">
                            {item.product?.name || "Product"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Qty: {quantity}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-[#13315C]">
                        {formatCurrency(total)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Trust information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#155daf]">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#13315C]">
                      Secure payment
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your payment is securely processed through our payment
                      provider.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#155daf]">
                    <Truck size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#13315C]">
                      Delivery
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your order will be prepared after payment is successfully
                      confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24">
              <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                <h2 className="text-lg font-bold text-[#13315C]">
                  Order Summary
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Final total for this order.
                </p>
              </div>

              <div className="space-y-4 px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-600">Subtotal</span>

                  <span className="font-semibold text-[#13315C]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-600">Shipping</span>

                  <span
                    className={
                      shipping === 0
                        ? "font-semibold text-green-600"
                        : "font-semibold text-[#13315C]"
                    }
                  >
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-[#13315C]">Total</span>

                    <span className="text-xl font-extrabold text-[#155daf]">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Desktop submit */}
                <button
                  type="button"
                  disabled={checkoutLoading}
                  onClick={(event) => {
                    const form =
                      event.currentTarget.closest(".checkout-wrapper");

                    if (form) {
                      const checkoutForm = form.querySelector("form");

                      if (checkoutForm instanceof HTMLFormElement) {
                        checkoutForm.requestSubmit();
                      }
                    }
                  }}
                  className="hidden w-full items-center justify-center gap-2 rounded-md bg-[#155daf] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#13315C] disabled:cursor-not-allowed disabled:bg-gray-400 lg:flex"
                >
                  {checkoutLoading ? (
                    <>
                      <Spinner />
                      Preparing payment...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#13315C] transition-colors hover:border-[#155daf] hover:text-[#155daf]"
                >
                  Return to Cart
                </Link>
              </div>

              {/* Reassurance */}
              <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <p className="text-xs leading-5 text-gray-500">
                      Review your address before continuing.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <p className="text-xs leading-5 text-gray-500">
                      You will be redirected to secure payment.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <p className="text-xs leading-5 text-gray-500">
                      Your order is confirmed after payment verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden="true"
    />
  );
}

function CheckoutSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded bg-gray-200" />

      <div className="mt-5 h-8 w-40 rounded bg-gray-200" />

      <div className="mt-2 h-4 w-72 rounded bg-gray-100" />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-5 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="h-5 w-36 rounded bg-gray-200" />

              <div className="mt-2 h-3 w-52 rounded bg-gray-100" />
            </div>

            <div className="p-6">
              <div className="h-4 w-32 rounded bg-gray-200" />

              <div className="mt-3 h-28 rounded-lg bg-gray-100" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="h-5 w-28 rounded bg-gray-200" />
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 p-5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gray-200" />

                  <div>
                    <div className="h-4 w-40 rounded bg-gray-200" />

                    <div className="mt-2 h-3 w-16 rounded bg-gray-100" />
                  </div>
                </div>

                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
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
