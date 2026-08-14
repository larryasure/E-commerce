import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../api/axiosConfig";
import { formatCurrency } from "../utils/formatCurrency";



const STAMP_STYLES = {
  PROCESSING: { color: "#CA8A04", label: "Processing" },
  SHIPPED: { color: "#155daf", label: "Shipped" },
  DELIVERED: { color: "#16A34A", label: "Delivered" },
  CANCELED: { color: "#DC2626", label: "Void" },
};

function StatusStamp({ status }) {
  const stamp = STAMP_STYLES[status] || { color: "#6B7280", label: status };
  return (
    <div
      className="inline-flex items-center justify-center px-3 py-1 border-2 rounded-sm  text-[11px] font-bold uppercase tracking-[0.15em] -rotate-3 select-none"
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

function reached(status, key) {
  if (key === "ORDERED") return true;
  if (key === "SHIPPED") return ["SHIPPED", "DELIVERED"].includes(status);
  if (key === "DELIVERED") return status === "DELIVERED";
  return false;
}

// function Barcode() {
//   const bars = "2,1,3,1,1,2,4,1,2,3,1,1,2,1,3,2,1,3,1,2,1,3,2,1";
//   return (
//     <div className="flex items-end gap-[2px] h-8 mt-3">
//       {bars.split(",").map((w, i) => (
//         <span key={i} className="bg-[#13315c]" style={{ width: `${w}px`, height: "100%" }} />
//       ))}
//     </div>
//   );
// }



export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`orders/${id}/`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to load order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[#13315c] rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen py-22 bg-gray-50 text-center">
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  const subtotal =
    order.subtotal ?? order.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;
  const shippingFee = order.shipping ?? 0;
  const tax = order.tax ?? 0;

  return (
    <div className="py-12 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#13315c] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to orders
        </NavLink>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-1">
                  Order No.
                </p>
                <h1 className=" text-2xl font-bold text-[#13315c] tracking-tight">
                  {order.order_number}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Placed{" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <StatusStamp status={order.order_status} />
            </div>
          </div>

          <div className="p-8 sm:p-10 border-b border-gray-100">
            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-6">
              Tracking
            </p>
            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const done = reached(order.order_status, step.key);
                const isLast = i === STEPS.length - 1;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${
                          done ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
                        }`}
                      />
                      {!isLast && (
                        <div
                          className={`w-[2px] flex-1 min-h-[36px] ${
                            reached(order.order_status, STEPS[i + 1].key)
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <p className={`pb-9 font-medium ${done ? "text-[#13315c]" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-8 sm:p-10 border-b border-gray-100">
            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-5">
              Items
            </p>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-baseline gap-2">
                  <span className="text-[#13315c] font-medium whitespace-nowrap">
                    {item.quantity}× {item.product?.name}
                  </span>
                  <span className="flex-1 border-b border-dotted border-gray-300 translate-y-[-4px]" />
                  <span className=" text-sm text-[#13315c] whitespace-nowrap">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-2">
                Ship To
              </p>
              <p className="text-[#13315c] font-medium leading-relaxed">{order.order_address}</p>
            </div>

            <div className="text-sm">
              <div className="flex justify-between text-gray-500 mb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500 mb-2">
                <span>Shipping</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-gray-500 mb-3">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-[#13315c] font-bold text-lg pt-3 border-t border-dashed border-gray-300">
                <span>Total</span>
                <span>{formatCurrency(order.total_price)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">Thank you for your order.</p>
      </div>
    </div>
  );
}