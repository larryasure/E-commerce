"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { axiosInstance } from "@/lib/api/client";
import { OrderSerializer } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";

const STAMP_STYLES: Record<string, { color: string; label: string }> = {
  PROCESSING: { color: "#CA8A04", label: "Processing" },
  SHIPPED: { color: "#155daf", label: "Shipped" },
  DELIVERED: { color: "#16A34A", label: "Delivered" },
  CANCELED: { color: "#DC2626", label: "Void" },
};

function StatusStamp({ status }: { status: string }) {
  const normalizedStatus = (status || "").toUpperCase();
  const stamp = STAMP_STYLES[normalizedStatus] || {
    color: "#6B7280",
    label: status,
  };

  return (
    <div
      className="inline-flex items-center justify-center px-3 py-1 border-2 rounded-sm text-[11px] font-bold uppercase tracking-[0.15em] -rotate-3 select-none"
      style={{ color: stamp.color, borderColor: stamp.color }}
    >
      {stamp.label}
    </div>
  );
}

const STEPS = [
  { key: "ORDERED", label: "Order placed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

function reached(status: string, key: string) {
  const normStatus = (status || "").toUpperCase();
  if (key === "ORDERED") return true;
  if (key === "SHIPPED") return ["SHIPPED", "DELIVERED"].includes(normStatus);
  if (key === "DELIVERED") return normStatus === "DELIVERED";
  return false;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { token } = useAuthStore();
  const [order, setOrder] = useState<OrderSerializer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;

    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get<OrderSerializer>(`/orders/${id}/`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to load order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-50 mt-20">
        <div className="loading loading-xl loading-infinity" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen py-22 bg-slate-50 text-center mt-20">
        <p className="text-slate-500 font-medium">Order not found.</p>
      </div>
    );
  }

  const subtotal =
    order.items?.reduce(
      (sum, i) => sum + (Number(i?.price) || 0) * (Number(i?.quantity) || 0),
      0,
    ) ?? 0;
  const shippingFee = 0;
  const tax = 0;

  // Safe Date parsing validation
  const orderDate = order.created_at ? new Date(order.created_at) : new Date();
  const isValidDate = !isNaN(orderDate.getTime());

  return (
    <div className="py-12 min-h-screen bg-slate-50/50 mt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-[#13315c] transition-colors mb-6 group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to orders
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* HEADER BAR */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">
                  Order Reference
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-[#13315c] tracking-tight">
                  {order.order_number || `#${id?.substring(0, 8)}`}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                  Placed on{" "}
                  {isValidDate
                    ? orderDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Recent Date"}
                </p>
              </div>
              <StatusStamp status={order.order_status || ""} />
            </div>
          </div>

          {/* TRACKING MODULE */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-6">
              Delivery Progress
            </p>
            <div className="flex flex-col">
              {STEPS.map((step, i) => {
                const done = reached(order.order_status || "", step.key);
                const isLast = i === STEPS.length - 1;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 bg-white shrink-0" />
                      )}
                      {!isLast && (
                        <div
                          className={`w-[2px] flex-1 min-h-[32px] my-1 rounded-full ${
                            reached(order.order_status || "", STEPS[i + 1].key)
                              ? "bg-emerald-500"
                              : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`pt-0.5 pb-7 text-sm font-semibold tracking-tight ${
                        done ? "text-[#13315c]" : "text-slate-400 font-medium"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ITEMS BREAKDOWN */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-5">
              Purchased Items
            </p>
            <div className="flex flex-col gap-3.5">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => {
                  if (!item) return null;
                  const price = Number(item.price) || 0;
                  const qty = Number(item.quantity) || 0;
                  return (
                    <div
                      key={item.id}
                      className="flex items-baseline gap-2 text-sm"
                    >
                      <span className="text-[#13315c] font-semibold whitespace-nowrap">
                        {qty}{" "}
                        <span className="text-slate-400 font-normal px-1">
                          ×
                        </span>{" "}
                        {item.product?.name || "Product Item"}
                      </span>
                      <span className="flex-1 border-b border-dotted border-slate-200 translate-y-[-4px]" />
                      <span className="font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(price * qty)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs italic text-slate-400">
                  No items registered in this transaction.
                </p>
              )}
            </div>
          </div>

          {/* SUMMARY MATRIX */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 bg-slate-50/20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-2.5">
                Shipping Details
              </p>
              <p className="text-[#13315c] font-semibold text-sm leading-relaxed bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm/5">
                {order.shipping_address || "No shipping address attached."}
              </p>
            </div>

            <div className="text-sm flex flex-col justify-end gap-2.5">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span className="text-slate-900 font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Shipping Fee</span>
                <span className="text-slate-900 font-semibold">
                  {formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium pb-2">
                <span>Estimated Tax</span>
                <span className="text-slate-900 font-semibold">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="flex justify-between text-[#13315c] font-extrabold text-base pt-3.5 border-t border-dashed border-slate-200">
                <span>Grand Total</span>
                <span className="text-lg tracking-tight">
                  {formatCurrency(Number(order.total_price) || subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs font-medium text-slate-400 mt-8 tracking-wide">
          Thank you for choosing us. If you have any inquiries, contact support.
        </p>
      </div>
    </div>
  );
}
