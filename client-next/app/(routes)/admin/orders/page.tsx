"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Package,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

import { axiosInstance } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import { OrderSerializer } from "@/lib/types/";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type StatusKey = "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";

type SortOption = "newest" | "oldest" | "highest" | "lowest";

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG: Record<
  StatusKey,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  PROCESSING: {
    label: "Processing",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
  },

  SHIPPED: {
    label: "In transit",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: Truck,
  },

  DELIVERED: {
    label: "Delivered",
    className: "border-green-200 bg-green-50 text-green-700",
    icon: CheckCircle2,
  },

  CANCELED: {
    label: "Canceled",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: X,
  },
};

const STATUS_TABS = [
  { key: "ALL", label: "All orders" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "In transit" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELED", label: "Canceled" },
];

type OrdersResponse = {
  results?: OrderSerializer[];
  next?: string | null;
  previous?: string | null;
  count?: number;
};

export default function AdminOrdersPage() {
  const { token } = useAuthStore();

  const [orders, setOrders] = useState<OrderSerializer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchAllOrders = async () => {
      try {
        setLoading(true);

        let url: string | null = "/orders/";
        let allOrders: OrderSerializer[] = [];

        while (url) {
          const response = await axiosInstance.get<
            OrdersResponse | OrderSerializer[]
          >(url);

          const data = response.data;

          if (Array.isArray(data)) {
            allOrders = [...allOrders, ...data];
            url = null;
            break;
          }

          const pageOrders = Array.isArray(data?.results) ? data.results : [];

          allOrders = [...allOrders, ...pageOrders];

          url = data?.next ?? null;
        }

        if (!cancelled) {
          setOrders(allOrders);
        }
      } catch (error) {
        console.error("Failed to load orders", error);

        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAllOrders();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      const status = String(order.order_status ?? "").toUpperCase();

      const orderNumber = String(order.order_number ?? "").toLowerCase();

      const username = String(order.user?.username ?? "").toLowerCase();

      const email = String(order.user?.email ?? "").toLowerCase();

      const matchesStatus = activeStatus === "ALL" || status === activeStatus;

      const matchesSearch =
        !query ||
        orderNumber.includes(query) ||
        username.includes(query) ||
        email.includes(query);

      return matchesStatus && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );

        case "highest":
          return Number(b.total_price ?? 0) - Number(a.total_price ?? 0);

        case "lowest":
          return Number(a.total_price ?? 0) - Number(b.total_price ?? 0);

        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });
  }, [orders, searchTerm, activeStatus, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeStatus, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total_price ?? 0),
    0,
  );

  const processingCount = orders.filter(
    (order) => String(order.order_status).toUpperCase() === "PROCESSING",
  ).length;

  const shippedCount = orders.filter(
    (order) => String(order.order_status).toUpperCase() === "SHIPPED",
  ).length;

  const deliveredCount = orders.filter(
    (order) => String(order.order_status).toUpperCase() === "DELIVERED",
  ).length;

  if (loading) {
    return <OrdersSkeleton />;
  }

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <ShoppingBag className="h-6 w-6 text-blue-800" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Sign in required
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Sign in to manage customer orders.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Store management</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Review customer orders, monitor fulfillment, and manage order
            activity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShoppingBag className="h-4 w-4" />
          {orders.length} total orders
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total orders"
          value={orders.length}
          icon={<ShoppingBag className="h-5 w-5" />}
          description="All customer orders"
        />

        <SummaryCard
          label="Processing"
          value={processingCount}
          icon={<Clock3 className="h-5 w-5" />}
          description="Orders being prepared"
        />

        <SummaryCard
          label="In transit"
          value={shippedCount}
          icon={<Truck className="h-5 w-5" />}
          description="Orders shipped"
        />

        <SummaryCard
          label="Delivered"
          value={deliveredCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Completed deliveries"
        />
      </div>

      {/* Revenue */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Order value
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              {formatCurrency(totalRevenue)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Combined value of all orders
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
            <Package className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main orders section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search order number, customer or email..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100 sm:w-48"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest">Highest value</option>
                <option value="lowest">Lowest value</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Status tabs */}
          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-max gap-1">
              {STATUS_TABS.map((tab) => {
                const active = activeStatus === tab.key;

                const count =
                  tab.key === "ALL"
                    ? orders.length
                    : orders.filter(
                        (order) =>
                          String(order.order_status).toUpperCase() === tab.key,
                      ).length;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveStatus(tab.key)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-blue-800 text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    {tab.label}

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:px-5">
          <p className="text-sm text-gray-500">
            {filteredOrders.length === 0
              ? "No orders found"
              : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredOrders.length,
                )} of ${filteredOrders.length} orders`}
          </p>
        </div>

        {/* Desktop table */}
        {filteredOrders.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-white text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {paginatedOrders.map((order) => (
                <MobileOrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyOrders
            hasSearch={Boolean(searchTerm)}
            hasFilter={activeStatus !== "ALL"}
            onClear={() => {
              setSearchTerm("");
              setActiveStatus("ALL");
            }}
          />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Order row                                                                  */
/* -------------------------------------------------------------------------- */

function OrderRow({ order }: { order: OrderSerializer }) {
  const status = getStatusConfig(order.order_status);

  const StatusIcon = status.icon;

  return (
    <tr className="group transition hover:bg-gray-50/70">
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-bold text-gray-900">
            #{order.order_number}
          </p>

          <p className="mt-1 text-xs text-gray-400">Order ID: {order.id}</p>
        </div>
      </td>

      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {order.user?.username || "Customer"}
          </p>

          {order.user?.email && (
            <p className="mt-1 max-w-[200px] truncate text-xs text-gray-400">
              {order.user.email}
            </p>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm font-bold text-gray-900">
          {formatCurrency(Number(order.total_price ?? 0))}
        </p>
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={order.order_status} />
      </td>

      <td className="px-6 py-4">
        <p className="text-sm text-gray-600">
          {formatOrderDate(order.created_at)}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {formatOrderTime(order.created_at)}
        </p>
      </td>

      <td className="px-6 py-4 text-right">
        <Link
          href={`/admin/orders/${order.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile order card                                                          */
/* -------------------------------------------------------------------------- */

function MobileOrderCard({ order }: { order: OrderSerializer }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-900">
            #{order.order_number}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formatOrderDate(order.created_at)}
          </p>
        </div>

        <StatusBadge status={order.order_status} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400">Customer</p>

          <p className="mt-1 truncate text-sm font-medium text-gray-900">
            {order.user?.username || "Customer"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Total</p>

          <p className="mt-1 text-sm font-bold text-gray-900">
            {formatCurrency(Number(order.total_price ?? 0))}
          </p>
        </div>
      </div>

      <Link
        href={`/admin/orders/${order.id}`}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <Eye className="h-4 w-4" />
        View order
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status?: string }) {
  const config = getStatusConfig(status);

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary card                                                               */
/* -------------------------------------------------------------------------- */

function SummaryCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyOrders({
  hasSearch,
  hasFilter,
  onClear,
}: {
  hasSearch: boolean;
  hasFilter: boolean;
  onClear: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <ShoppingBag className="h-6 w-6 text-gray-400" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {hasSearch || hasFilter ? "No matching orders" : "No orders yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasSearch || hasFilter
          ? "Try changing your search or status filter."
          : "Customer orders will appear here when they are placed."}
      </p>

      {(hasSearch || hasFilter) && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getStatusConfig(status?: string) {
  const normalized = String(status ?? "PROCESSING").toUpperCase() as StatusKey;

  return (
    STATUS_CONFIG[normalized] ?? {
      label: status || "Unknown",
      className: "border-gray-200 bg-gray-50 text-gray-600",
      icon: Clock3,
    }
  );
}

function formatOrderDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatOrderTime(date?: string) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

/* -------------------------------------------------------------------------- */
/* Loading skeleton                                                           */
/* -------------------------------------------------------------------------- */

function OrdersSkeleton() {
  return (
    <div className="space-y-7">
      <div className="animate-pulse border-b border-gray-200 pb-6">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="mt-3 h-8 w-36 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex justify-between">
              <div>
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="mt-3 h-7 w-14 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-28 rounded bg-gray-200" />
              </div>

              <div className="h-10 w-10 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="animate-pulse border-b border-gray-200 p-5">
          <div className="h-11 max-w-md rounded-lg bg-gray-200" />

          <div className="mt-5 h-9 w-full max-w-lg rounded-lg bg-gray-200" />
        </div>

        <div className="space-y-0 divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-24 rounded bg-gray-200" />
              </div>

              <div className="hidden h-8 w-20 rounded bg-gray-200 md:block" />

              <div className="h-8 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
