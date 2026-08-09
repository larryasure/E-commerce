import { CheckCircle2, Package, Truck, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";
const STAMP_STYLES = {
  PROCESSING: { color: "#ffb055", label: "Processing" },
  SHIPPED: { color: "#155daf", label: "Shipped" },
  DELIVERED: { color: "#00a93e", label: "Delivered" },
  CANCELED: { color: "#ff3939", label: "Void" },
};

function StatusStamp({ status }) {
  const stamp = STAMP_STYLES[status] || {
    color: "text-gray-600",
    label: status,
  };
  return (
    <div
      className="inline-flex items-center justify-center px-3  py-1 border-2 rounded-sm  text-xs font-bold uppercase tracking-widest -rotate-3 select-none"
      style={{ color: stamp.color, borderColor: stamp.color }}
    >
      {stamp.label}
    </div>
  );
}

function OrderStats({ orders }) {
  const total = orders.length;
  const inTransit = orders.filter((o) => o.order_status === "SHIPPED").length;
  const delivered = orders.filter((o) => o.order_status === "DELIVERED").length;

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.total_price || 0),
    0,
  );

  const stats = [
    { label: "Total Orders", value: total, icon: Package, color: "#155daf" },
    { label: "In Transit", value: inTransit, icon: Truck, color: "#13315c" },
    {
      label: "Total Orders",
      value: delivered,
      icon: CheckCircle2,
      color: "#16A34A",
    },
    {
      label: "Total Orders",
      value: formatCurrency(totalSpent),
      icon: Wallet,
      color: "#155daf",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          className="bg-white rounded-2xl border border-gray-200 p-5 "
          key={label}
        >
          <div className="flex items-center gap-2 mb-3 ">
            <Icon size={16} style={{ color }} />

            <p className="text-2xl font-bold text-[#13315c]">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = ["All", "Processing", "Shipped", "Delivered", "Canceled"];

function OrderFilterTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 mb-6 overflow-x-hidden pb-2 border-b border-gray-200">
      {TABS.map((tab) => {
        const isActive = active === tab;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${isActive ? "text-[#13315c]" : "text-gray-400 hover:text-[#13315c]"} `}
          >
            {tab}

            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#155daf]" />
            )}
          </button>
        );
      })}
    </div>
  );
}



export default function Orders() {
  return <div>Orders</div>;
}
