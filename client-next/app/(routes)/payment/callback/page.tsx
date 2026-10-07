"use client";

import { axiosInstance } from "@/lib/api/client";
import {
  Check,
  CheckCircle,
  Clock3,
  Loader2,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PaymentStatus = "verifying" | "delayed" | "success" | "failed";

interface PaymentVerificationResponse {
  status?: string;
  message?: string;
  order?: {
    order_number?: string;
  };
}

const VERIFICATION_TIMEOUT = 15000;

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const txRef = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transaction_id");
    const flutterwaveStatus = searchParams.get("status");

    console.log("Flutterwave callback parameters:", {
      txRef,
      transactionId,
      flutterwaveStatus,
    });

    if (!txRef || !transactionId) {
      console.error("Missing Flutterwave payment parameters.");

      setErrorMessage(
        "We could not find the payment information needed to verify this transaction.",
      );

      setStatus("failed");
      return;
    }

    if (
      flutterwaveStatus &&
      !["successful", "completed"].includes(flutterwaveStatus.toLowerCase())
    ) {
      console.error(
        "Flutterwave reported an unsuccessful payment:",
        flutterwaveStatus,
      );

      setErrorMessage("Flutterwave did not report this payment as successful.");

      setStatus("failed");
      return;
    }

    let cancelled = false;

    const verifyPayment = async () => {
      const timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          setStatus("delayed");
        }
      }, VERIFICATION_TIMEOUT);

      try {
        const response = await axiosInstance.post<PaymentVerificationResponse>(
          "/payments/verify/",
          {
            tx_ref: txRef,
            transaction_id: transactionId,
          },
        );

        if (cancelled) return;

        const payload = response.data ?? {};

        console.log("Payment verification response:", payload);

        setOrderNumber(payload.order?.order_number ?? "");

        if (payload.status === "PAID") {
          setStatus("success");
        } else {
          console.error("Payment verification did not return PAID:", payload);

          setErrorMessage(
            payload.message ||
              "We could not confirm this payment with our payment provider.",
          );

          setStatus("failed");
        }
      } catch (error: any) {
        if (cancelled) return;

        console.error(
          "Payment verification failed:",
          error.response?.data || error.message || error,
        );

        setErrorMessage(
          error.response?.data?.message ||
            "We could not confirm your payment right now.",
        );

        setStatus("failed");
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (status === "verifying") {
    return <VerifyingPayment />;
  }

  if (status === "delayed") {
    return <DelayedPayment />;
  }

  if (status === "success") {
    return <SuccessfulPayment orderNumber={orderNumber} />;
  }

  return <FailedPayment errorMessage={errorMessage} />;
}

function VerifyingPayment() {
  return (
    <main className="min-h-[75vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
            </div>

            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-yellow-600">
              Payment verification
            </p>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Confirming your payment
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              We&apos;re securely checking your transaction. This usually takes
              only a few moments.
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-5">
            <VerificationStep
              label="Payment received"
              description="Your payment information has been received."
              active
              completed
            />

            <VerificationStep
              label="Checking transaction"
              description="Confirming the transaction with Flutterwave."
              active
              loading
            />

            <VerificationStep
              label="Confirming your order"
              description="Your order will be updated once payment is confirmed."
              active={false}
            />
          </div>

          {/* Reassurance */}
          <div className="mt-8 rounded-lg border border-yellow-100 bg-yellow-50 p-4">
            <div className="flex gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Please don&apos;t make another payment
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Your payment is currently being verified. You can stay on this
                  page while we complete the confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DelayedPayment() {
  return (
    <main className="min-h-[75vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
            <Clock3 className="h-8 w-8 text-yellow-600" />
          </div>

          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-yellow-600">
            Verification taking longer than expected
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            We&apos;re still confirming your payment
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Your payment may still be processing. Please don&apos;t make another
            payment. You can check your orders while we finish confirming the
            transaction.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <ShoppingBag className="h-4 w-4" />
              Check my orders
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function SuccessfulPayment({ orderNumber }: { orderNumber: string }) {
  return (
    <main className="min-h-[75vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-600">
            Payment confirmed
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Order placed successfully
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Your payment has been confirmed and your order is now being
            processed.
          </p>

          {orderNumber && (
            <div className="mx-auto mt-7 max-w-sm rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Order number
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {orderNumber}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <ShoppingBag className="h-4 w-4" />
              View my orders
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function FailedPayment({ errorMessage }: { errorMessage: string }) {
  return (
    <main className="min-h-[75vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600">
            Payment verification
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            We couldn&apos;t confirm your payment
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            {errorMessage ||
              "We were unable to confirm this transaction at the moment."}
          </p>

          <div className="mt-6 rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-left">
            <p className="text-sm font-semibold text-gray-900">
              Did money leave your account?
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-600">
              Don&apos;t make another payment yet. Check your orders first or
              contact support if the payment remains unresolved.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <ShoppingBag className="h-4 w-4" />
              Check my orders
            </Link>

            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Return to checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function VerificationStep({
  label,
  description,
  active,
  completed,
  loading,
}: {
  label: string;
  description: string;
  active: boolean;
  completed?: boolean;
  loading?: boolean;
}) {
  return (
    <div className={`flex gap-4 ${active ? "opacity-100" : "opacity-40"}`}>
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            completed
              ? "bg-green-100 text-green-600"
              : loading
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-400"
          }`}
        >
          {completed ? (
            <Check className="h-5 w-5" />
          ) : loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-current" />
          )}
        </div>
      </div>

      <div className="pt-0.5">
        <p className="text-sm font-semibold text-gray-900">{label}</p>

        <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>
      </div>
    </div>
  );
}
