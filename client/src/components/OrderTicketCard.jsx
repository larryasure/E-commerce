import { NavLink } from "react-router-dom";
import { StatusStamp } from "../dashboard/Orders";
import { formatCurrency } from "../utils/formatCurrency";

export default function OrderTicketCard({ order }) {
  const currentStatus = order?.order_status;
  
  return (
    <>
      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-[0_1px_2px_rgba(19,49,92,0.04),0_10px_28px_-14px_rgba(19,49,92,0.15)]">
        <div className="p-6 sm:p-8 pb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6 ">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase mb-1 ">
                  Order No.
                </p>

                <h3 className="font-bold text-lg text-[#13315c] tracking-tight">
                  {order.order_number}
                </h3>
                <p className="text-sm text-gray-500 mt-1 ">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="sm:hidden">
                <StatusStamp status={currentStatus} />
              </div>
            </div>

            <div className="space-y-2.5">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-baseline gap-2">
                  <span className="text-[#13315c] whitespace-nowrap font-medium">
                    {item.quantity} x {item.product?.name}{" "}
                  </span>

                  <span className="flex-1 border-b border-dotted border-gray-300 -translate-y-1 " />
                  <span className="text-sm text-[#13315c] whitespace-nowrap">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

     
          <div className="hidden sm:block shrink-0 pt-1">
            <StatusStamp status={currentStatus} />
          </div>
        </div>

        <div className="relative">
          <div className="border-t-2 border-dashed  border-gray-200">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 border border-gray-200" />
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 border border-gray-200" />
          </div>
          <div className="p-6 sm:p-8 pt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider  text-gray-500 mb-1">
                Total
              </p>
              <p className="text-xl font-bold text-[#13315c] ">
                {formatCurrency(order.total_price)}
              </p>
            </div>
            <NavLink
              to={`/orders/${order.id}`}
              className="text-sm font-semibold text-[#155daf] hover:text-[#13315c] transition-all underline decoration-dotted underline-offset-4"
            >
              View receipt →
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
