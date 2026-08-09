import { NavLink } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import StatusBadge from "./Statusbadge";
import TrackingProgress from "./TrackingProgress";

export default function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-[#13315c] font-semibold">
              Order #{order.order_number}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <StatusBadge status={order.order_status} />
        </div>

        <div className="mb-6 space-y-3">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
            >
              <div>
                <p className="text-[#13315c] font-medium">
                  {item.product?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-bold text-[#155daf]">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
            <p className="text-[#13315c] font-medium">{order.order_address}</p>
          </div>
          <div className="">
            <p className="text-sm text-gray-500 mb-1 flex items-center justify-end">Order Total</p>
            <p className="text-[#155daf] font-bold flex items-center justify-end">
              {formatCurrency(order.total_price)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <NavLink
            to={`/order-detail/${order.id}`}
            className="bg-[#155daf] text-white font-medium hover:bg-[#13315c] transition-colors rounded-lg px-6 py-2.5"
          >
            View Details
          </NavLink>
        </div>
      </div>

      <div className="border-t border-gray-100 p-6">
        <TrackingProgress status={order.order_status} />
      </div>
    </div>
  );
}