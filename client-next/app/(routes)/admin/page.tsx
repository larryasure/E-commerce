"use client";

import { axiosInstance } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FolderTree,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
}

interface Order {
  id: number;
  order_number?: string;
  order_status?: string;
  payment_status?: string;
  total_price?: string | number;
  created_at?: string;
}

interface Product {
  id: number;
  name?: string;
  stock?: number;
  price?: string | number;
  is_active?: boolean;
}

interface ApiListResponse<T> {
  results?: T[];
  next?: string | null;
}

const initialStats: Stats = {
  totalProducts: 0,
  totalCategories: 0,
  totalOrders: 0,
  totalUsers: 0,
};

async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  const items: T[] = [];
  let nextUrl: string | null = endpoint;

  while (nextUrl) {
    const response = await axiosInstance.get<ApiListResponse<T> | T[]>(nextUrl);

    const data = response.data;

    if (Array.isArray(data)) {
      items.push(...data);
      break;
    }

    if (Array.isArray(data?.results)) {
      items.push(...data.results);
    }

    nextUrl = data?.next ?? null;
  }

  return items;
}

function StatCard({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: number;
  icon: typeof Package;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[#13315c]">
            {value.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#155daf]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-gray-200" />
      <div className="h-4 w-80 rounded bg-gray-200" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl border border-gray-200 bg-white"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="h-72 rounded-xl border border-gray-200 bg-white xl:col-span-2" />
        <div className="h-72 rounded-xl border border-gray-200 bg-white" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, token } = useAuthStore();

  const [stats, setStats] = useState<Stats>(initialStats);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [productList, categoryList, orderList, userList] =
          await Promise.all([
            fetchAllPages<Product>("/products/"),
            fetchAllPages("/categories/"),
            fetchAllPages<Order>("/orders/"),
            fetchAllPages("/users/"),
          ]);

        setStats({
          totalProducts: productList.length,
          totalCategories: categoryList.length,
          totalOrders: orderList.length,
          totalUsers: userList.length,
        });

        setOrders(orderList);
        setProducts(productList);
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const orderBreakdown = useMemo(() => {
    return {
      processing: orders.filter((order) => order.order_status === "PROCESSING")
        .length,

      shipped: orders.filter((order) => order.order_status === "SHIPPED")
        .length,

      delivered: orders.filter((order) => order.order_status === "DELIVERED")
        .length,

      canceled: orders.filter((order) => order.order_status === "CANCELED")
        .length,
    };
  }, [orders]);

  const inventorySummary = useMemo(() => {
    const outOfStock = products.filter(
      (product) => Number(product.stock ?? 0) <= 0,
    ).length;

    const lowStock = products.filter((product) => {
      const stock = Number(product.stock ?? 0);
      return stock > 0 && stock <= 5;
    }).length;

    return {
      outOfStock,
      lowStock,
    };
  }, [products]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const first = a.created_at ? new Date(a.created_at).getTime() : 0;

        const second = b.created_at ? new Date(b.created_at).getTime() : 0;

        return second - first;
      })
      .slice(0, 5);
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-[#155daf]">
            Prime Park Admin
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-[#13315c] sm:text-3xl">
            Welcome back,{" "}
            <span className="capitalize">{user?.username || "Admin"}</span>
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store, products, customers and orders from here.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#155daf] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13315c]"
          >
            <Plus size={17} />
            Add product
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ClipboardList size={17} />
            View orders
          </Link>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total products"
          value={stats.totalProducts}
          icon={Package}
          description="Products in your catalog"
        />

        <StatCard
          label="Categories"
          value={stats.totalCategories}
          icon={FolderTree}
          description="Active catalog categories"
        />

        <StatCard
          label="Total orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          description="Orders received"
        />

        <StatCard
          label="Customers"
          value={stats.totalUsers}
          icon={Users}
          description="Registered users"
        />
      </div>

      {/* Operational overview */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="font-bold text-[#13315c]">Order overview</h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Current order status across your store
              </p>
            </div>

            <BarChart3 size={20} className="text-gray-400" />
          </div>

          <div className="grid grid-cols-2 divide-x divide-gray-200 md:grid-cols-4">
            <div className="p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <ShoppingCart size={18} />
              </div>

              <p className="text-2xl font-bold text-[#13315c]">
                {orderBreakdown.processing}
              </p>

              <p className="mt-1 text-xs font-medium text-gray-500">
                Processing
              </p>
            </div>

            <div className="p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Package size={18} />
              </div>

              <p className="text-2xl font-bold text-[#13315c]">
                {orderBreakdown.shipped}
              </p>

              <p className="mt-1 text-xs font-medium text-gray-500">
                In transit
              </p>
            </div>

            <div className="p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <CheckCircle2 size={18} />
              </div>

              <p className="text-2xl font-bold text-[#13315c]">
                {orderBreakdown.delivered}
              </p>

              <p className="mt-1 text-xs font-medium text-gray-500">
                Delivered
              </p>
            </div>

            <div className="p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <ClipboardList size={18} />
              </div>

              <p className="text-2xl font-bold text-[#13315c]">
                {orderBreakdown.canceled}
              </p>

              <p className="mt-1 text-xs font-medium text-gray-500">Canceled</p>
            </div>
          </div>
        </section>

        {/* Inventory */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="font-bold text-[#13315c]">Inventory</h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Products that need attention
              </p>
            </div>

            <Package size={20} className="text-gray-400" />
          </div>

          <div className="space-y-1 p-5">
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Out of stock
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Products unavailable for purchase
                </p>
              </div>

              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                {inventorySummary.outOfStock}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">Low stock</p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Five units or fewer remaining
                </p>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-600">
                {inventorySummary.lowStock}
              </span>
            </div>

            <Link
              href="/admin/products"
              className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-[#155daf] transition-colors hover:bg-gray-50"
            >
              Manage products
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* Recent orders + quick actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent orders */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="font-bold text-[#13315c]">Recent orders</h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Your latest customer orders
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#155daf] hover:underline"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
              <ClipboardList size={30} className="mb-3 text-gray-300" />

              <p className="font-semibold text-gray-700">No orders yet</p>

              <p className="mt-1 text-sm text-gray-500">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#13315c]">
                      {order.order_number || `Order #${order.id}`}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString(
                            "en-NG",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        order.order_status === "DELIVERED"
                          ? "bg-green-50 text-green-700"
                          : order.order_status === "CANCELED"
                            ? "bg-red-50 text-red-700"
                            : order.order_status === "SHIPPED"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.order_status === "SHIPPED"
                        ? "In transit"
                        : order.order_status || "Pending"}
                    </span>

                    <ArrowRight size={16} className="text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-bold text-[#13315c]">Quick actions</h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Common store management tasks
            </p>
          </div>

          <div className="space-y-2 p-4">
            <Link
              href="/admin/products/new"
              className="group flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#155daf]">
                <Plus size={18} />
              </span>

              <span className="flex-1">
                <span className="block text-sm font-semibold text-gray-800">
                  Add product
                </span>

                <span className="block text-xs text-gray-500">
                  Create a new catalog item
                </span>
              </span>

              <ArrowRight
                size={16}
                className="text-gray-400 transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/admin/categories"
              className="group flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#155daf]">
                <FolderTree size={18} />
              </span>

              <span className="flex-1">
                <span className="block text-sm font-semibold text-gray-800">
                  Manage categories
                </span>

                <span className="block text-xs text-gray-500">
                  Organize your product catalog
                </span>
              </span>

              <ArrowRight
                size={16}
                className="text-gray-400 transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/admin/orders"
              className="group flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#155daf]">
                <ShoppingBag size={18} />
              </span>

              <span className="flex-1">
                <span className="block text-sm font-semibold text-gray-800">
                  Manage orders
                </span>

                <span className="block text-xs text-gray-500">
                  Review and process customer orders
                </span>
              </span>

              <ArrowRight
                size={16}
                className="text-gray-400 transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/admin/users"
              className="group flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#155daf]">
                <Users size={18} />
              </span>

              <span className="flex-1">
                <span className="block text-sm font-semibold text-gray-800">
                  Manage users
                </span>

                <span className="block text-xs text-gray-500">
                  View registered customers and admins
                </span>
              </span>

              <ArrowRight
                size={16}
                className="text-gray-400 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
