"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { useAuthStore } from "@/lib/stores/authStore";
import { axiosInstance } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type OrderItem = {
  id: number | string;
  quantity: number;
  price: number;
  product?: {
    name: string;
  };
};

type OrderSerializer = {
  id: number | string;
  order_number: number | string;
  order_status: string;
  created_at: string;
  total_price: number;
  items?: OrderItem[];
};

type OrderStats = {
  total_orders: number;
  in_transit: number;
  delivered: number;
  total_spent: number;
};

type OrdersResponse = {
  results?: OrderSerializer[];
  next?: string | null;
  previous?: string | null;
  count?: number;
  stats?: OrderStats;
};

type StatusConfig = {
  label: string;
  icon: typeof Package;
  className: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  PROCESSING: {
    label: "Processing",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },

  SHIPPED: {
    label: "In transit",
    icon: Truck,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },

  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "border-green-200 bg-green-50 text-green-700",
  },

  CANCELED: {
    label: "Canceled",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const TABS = [
  {
    key: "All",
    label: "All orders",
  },
  {
    key: "Processing",
    label: "Processing",
  },
  {
    key: "Shipped",
    label: "In transit",
  },
  {
    key: "Delivered",
    label: "Delivered",
  },
  {
    key: "Canceled",
    label: "Canceled",
  },
];

function getStatusConfig(status: string): StatusConfig {
  return (
    STATUS_CONFIG[status?.toUpperCase()] ?? {
      label: status || "Unknown",
      icon: Package,
      className: "border-gray-200 bg-gray-50 text-gray-700",
    }
  );
}

function formatOrderDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatOrderNumber(orderNumber: number | string) {
  return `#${orderNumber}`;
}

export default function OrdersPage() {
  const { token } = useAuthStore();

  const [orders, setOrders] = useState<OrderSerializer[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchAllOrders = async () => {
      try {
        setLoading(true);

        let url: string | null = "/orders/";
        let allOrders: OrderSerializer[] = [];
        let firstPageStats: OrderStats | null = null;

        while (url) {
          const response = await axiosInstance.get(url);
          const data: OrdersResponse | OrderSerializer[] = response.data;

          /*
           * Non-paginated response
           */
          if (Array.isArray(data)) {
            allOrders = [...allOrders, ...data];
            url = null;
            break;
          }

          /*
           * Paginated response
           */
          const pageOrders = Array.isArray(data?.results) ? data.results : [];

          allOrders = [...allOrders, ...pageOrders];

          /*
           * Stats normally come from the first response.
           */
          if (!firstPageStats && data?.stats) {
            firstPageStats = data.stats;
          }

          /*
           * DRF returns:
           *
           * next: "http://localhost:8000/api/orders/?page=2"
           *
           * or:
           *
           * next: null
           */
          url = data?.next ?? null;
        }

        if (cancelled) return;

        setOrders(allOrders);
        setStats(firstPageStats);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load orders", error);
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

  /*
   * Filter orders locally after ALL pages have been loaded.
   */
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const normalizedStatus = order.order_status?.toUpperCase();

      const matchesTab =
        activeTab === "All" || normalizedStatus === activeTab.toUpperCase();

      if (!matchesTab) {
        return false;
      }

      if (!query) {
        return true;
      }

      const orderNumber = order.order_number?.toString().toLowerCase() ?? "";

      const productNames =
        order.items
          ?.map((item) => item.product?.name ?? "")
          .join(" ")
          .toLowerCase() ?? "";

      return orderNumber.includes(query) || productNames.includes(query);
    });
  }, [orders, activeTab, search]);

  /*
   * Counts are calculated from ALL orders,
   * not only the first paginated page.
   */
  const getTabCount = (tab: string) => {
    if (tab === "All") {
      return orders.length;
    }

    return orders.filter(
      (order) => order.order_status?.toUpperCase() === tab.toUpperCase(),
    ).length;
  };

  if (!token && !loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <ShoppingBag className="h-6 w-6 text-gray-600" />
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              Sign in to view your orders
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your order history and delivery information will appear here.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-900"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-gray-200 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">Account</p>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              My Orders
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              View your order history, track deliveries, and manage your
              purchases.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        {!loading && stats && (
          <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Total orders"
              value={stats.total_orders}
              icon={<ShoppingBag className="h-5 w-5" />}
            />

            <StatCard
              label="In transit"
              value={stats.in_transit}
              icon={<Truck className="h-5 w-5" />}
            />

            <StatCard
              label="Delivered"
              value={stats.delivered}
              icon={<CheckCircle2 className="h-5 w-5" />}
            />

            <StatCard
              label="Total spent"
              value={formatCurrency(stats.total_spent)}
              icon={<Package className="h-5 w-5" />}
            />
          </section>
        )}

        {/* Search */}
        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by order number or product"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div className="text-sm text-gray-500">
              {loading
                ? "Loading orders..."
                : `${filteredOrders.length} ${
                    filteredOrders.length === 1 ? "order" : "orders"
                  }`}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-max border-b border-gray-200">
              {TABS.map((tab) => {
                const active = activeTab === tab.key;
                const count = getTabCount(tab.key);

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab.label}

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                        active
                          ? "bg-blue-800 text-white"
                          : "bg-blue-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>

                    {active && (
                      <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-blue-800" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Orders */}
        <section className="mt-6">
          {loading ? (
            <OrdersSkeleton />
          ) : filteredOrders.length === 0 ? (
            <EmptyOrders
              hasSearch={Boolean(search.trim())}
              activeTab={activeTab}
              onClear={() => {
                setSearch("");
                setActiveTab("All");
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-bold text-gray-900 sm:text-2xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-gray-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: OrderSerializer }) {
  const status = getStatusConfig(order.order_status);
  const StatusIcon = status.icon;

  const items = order.items ?? [];

  const itemCount = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300">
      {/* Order header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Order
            </p>

            <p className="mt-1 text-sm font-bold text-gray-900">
              {formatOrderNumber(order.order_number)}
            </p>
          </div>

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Placed
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {formatOrderDate(order.created_at)}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-5 sm:px-6">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.product?.name ?? "Product"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-semibold text-gray-900">
                  {formatCurrency(Number(item.price) * Number(item.quantity))}
                </p>
              </div>
            ))}

            {items.length > 3 && (
              <p className="pt-1 text-xs font-medium text-gray-500">
                + {items.length - 3} more{" "}
                {items.length - 3 === 1 ? "item" : "items"}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Package className="h-5 w-5 text-gray-400" />
            Order items unavailable
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-5">
          <div>
            <p className="text-xs text-gray-500">Items</p>

            <p className="mt-0.5 text-sm font-semibold text-gray-900">
              {itemCount}
            </p>
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <div>
            <p className="text-xs text-gray-500">Order total</p>

            <p className="mt-0.5 text-base font-bold text-gray-900">
              {formatCurrency(order.total_price)}
            </p>
          </div>
        </div>

        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          View order
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function EmptyOrders({
  hasSearch,
  activeTab,
  onClear,
}: {
  hasSearch: boolean;
  activeTab: string;
  onClear: () => void;
}) {
  const filteredBySearch = hasSearch;
  const filteredByTab = activeTab !== "All";

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
        {filteredBySearch || filteredByTab ? (
          <Search className="h-6 w-6 text-gray-500" />
        ) : (
          <ShoppingBag className="h-6 w-6 text-gray-500" />
        )}
      </div>

      <h2 className="mt-5 text-lg font-semibold text-gray-900">
        {filteredBySearch
          ? "No matching orders"
          : filteredByTab
            ? `No ${activeTab.toLowerCase()} orders`
            : "You haven't placed any orders yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {filteredBySearch
          ? "Try searching with a different order number or product name."
          : filteredByTab
            ? "Orders with this status will appear here."
            : "Once you place an order, you’ll be able to track and manage it from here."}
      </p>

      {filteredBySearch || filteredByTab ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Clear filters
        </button>
      ) : (
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-900"
        >
          Start shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white"
        >
          <div className="animate-pulse border-b border-gray-100 bg-gray-50 px-6 py-5">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-24 rounded bg-gray-200" />
          </div>

          <div className="space-y-4 px-6 py-6">
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-lg bg-gray-200" />

              <div className="flex-1">
                <div className="h-4 w-48 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-20 rounded bg-gray-200" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex justify-between">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-9 w-28 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
