import { CheckCircle2, Package, Search, Truck, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import OrderTicketCard from "../components/OrderTicketCard";
import Pagination from "../components/Pagination";
import { formatCurrency } from "../utils/formatCurrency";

const STAMP_STYLES = {
  PROCESSING: { color: "#D97706", label: "Processing" },
  SHIPPED: { color: "#2563EB", label: "Shipped" },
  DELIVERED: { color: "#16A34A", label: "Delivered" },
  CANCELED: { color: "#DC2626", label: "Void" },
};

export const StatusStamp = ({ status }) => {
  const normalizedStatus = status?.toUpperCase();
  const stamp = STAMP_STYLES[normalizedStatus] || {
    color: "#4B5563",
    label: status || "UNKNOWN",
  };

  return (
    <div
      className="inline-flex items-center justify-center px-3 py-1 border-2 rounded-sm text-xs font-bold uppercase tracking-widest -rotate-3 select-none"
      style={{ color: stamp.color, borderColor: stamp.color }}
    >
      {stamp.label}
    </div>
  );
};

function OrderStats({ stats }) {
  const total = stats?.total_orders || 0;
  const inTransit = stats?.in_transit || 0;
  const delivered = stats?.delivered || 0;
  const totalSpent = stats?.total_spent || 0;

  const statsList = [
    { label: "Total Orders", value: total, icon: Package, color: "#155daf" },
    { label: "In Transit", value: inTransit, icon: Truck, color: "#13315c" },
    {
      label: "Delivered",
      value: delivered,
      icon: CheckCircle2,
      color: "#16A34A",
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: Wallet,
      color: "#155daf",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsList.map(({ label, value, icon: Icon, color }) => (
        <div
          className="bg-white rounded-2xl border border-gray-200 p-5"
          key={label}
        >
          <div className="flex items-center gap-2 mb-3">
            <Icon size={16} style={{ color }} />
            <p className="text-xs text-gray-400 font-medium ml-auto uppercase tracking-wider">
              {label}
            </p>
          </div>
          <p className="text-2xl font-bold text-[#13315c]">{value}</p>
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
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [totalPages, setTotalPages] = useState(0)
  const [stats, setStats] = useState(null)


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get(`orders/?page=${currentPage}`);

        setOrders(response.data.results || []);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
        setTotalPages(response.data.total_pages)
        setStats(response.data.stats)
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const filteredOrders = useMemo(() => {
    const ordersList = Array.isArray(orders) ? orders : [];
    return ordersList.filter((order) => {
      const matchesTab =
        activeTab === "All" || order.order_status === activeTab.toUpperCase();
      const matchesSearch = order.order_number
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[#13315c] rounded-full animate-spin" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen py-22 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#13315c] mb-8">My Orders</h1>
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              You haven't placed any orders yet
            </p>
            <NavLink
              to="/products"
              className="inline-block bg-[#155daf] text-white px-6 py-3 rounded-lg hover:bg-[#13315c] transition-colors font-semibold"
            >
              Start Shopping
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-1">
              Account
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#13315c]">
              My Orders
            </h2>
          </div>
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order number..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#155daf]/25"
            />
          </div>
        </div>

        <OrderStats stats={stats} />
        <OrderFilterTabs active={activeTab} onChange={setActiveTab} />

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            No orders match this filter.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderTicketCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        nextPage={nextPage}
        previousPage={previousPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
