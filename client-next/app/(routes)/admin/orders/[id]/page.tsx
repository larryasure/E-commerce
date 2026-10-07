"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { axiosInstance } from "@/lib/api/client";
import { OrderSerializer } from "@/lib/types/";
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { token } = useAuthStore();
  const [order, setOrder] = useState<OrderSerializer | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get<OrderSerializer>(
          `/orders/${id}/`,
        );
        setOrder(response.data);
        setNewStatus(response.data.order_status ?? "");
      } catch (error) {
        console.error("Failed to load order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const handleUpdateStatus = async () => {
    if (!token || !order) return;

    try {
      await axiosInstance.patch(`/orders/${order.id}/`, {
        order_status: newStatus,
      });
      setOrder({
        ...order,
        order_status: newStatus as OrderSerializer["order_status"],
      });
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-[#13315c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-[#155daf] hover:text-[#13315c] font-semibold"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                  Order No.
                </p>
                <h1 className="text-3xl font-bold text-[#13315c]">
                  {order.order_number}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                  Date
                </p>
                <p className="text-lg font-semibold text-[#13315c]">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-[#13315c] mb-4">Items</h3>
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between mb-3 pb-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-[#13315c]">
                      {item.product?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-[#155daf]">
                    {formatCurrency(item.price * (item.quantity ?? 0))}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="font-bold text-[#13315c] mb-4">
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold text-[#13315c]">Name:</span>{" "}
                <span className="text-gray-600 capitalize">
                  {order.user?.username}
                </span>
              </p>
              <p>
                <span className="font-semibold text-[#13315c]">Email:</span>{" "}
                <span className="text-gray-600">{order.user?.email}</span>
              </p>
              <p>
                <span className="font-semibold text-[#13315c]">Phone:</span>{" "}
                <span className="text-gray-600">
                  {order.user?.profile?.phone_number || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="font-bold text-[#13315c] mb-4">Shipping Address</h3>
            <p className="text-gray-600 leading-relaxed">
              {order.shipping_address}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-[#13315c] mb-4">Order Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#155daf] rounded-lg focus:outline-none focus:ring focus:ring-[#155daf] mb-4"
            >
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELED">Canceled</option>
            </select>
            {newStatus !== order.order_status && (
              <button
                onClick={handleUpdateStatus}
                className="w-full bg-[#155daf] hover:bg-[#13315c] text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Update Status
              </button>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-[#13315c] mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(
                    order.items?.reduce(
                      (sum, i) => sum + i.price * (i.quantity ?? 0),
                      0,
                    ) || 0,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#13315c]">Total</span>
              <span className="text-2xl font-bold text-[#155daf] tracking-wider">
                {formatCurrency(order.total_price ?? 0)}
              </span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-[#13315c] mb-4">Payment Status</h3>
            <div
              className={`px-4 py-2 rounded-lg text-center font-semibold text-sm ${
                order.payment_status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : order.payment_status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {order.payment_status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
