"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import ProtectedRoute from "@/components/ProtectedRoutes";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <LayoutDashboard className="shrink-0 w-5 h-5" />,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: <Package className="shrink-0 w-5 h-5" />,
  },

  {
    label: "Categories",
    path: "/admin/categories",
    icon: <Layers className="shrink-0 w-5 h-5" />,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: <ShoppingCart className="shrink-0 w-5 h-5" />,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <Users className="shrink-0 w-5 h-5" />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    router.push("/");
  };


  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-42" : "w-24"
          } bg-[#13315C] text-white transition-all duration-300 flex flex-col`}
        >
          <div className="py-4.5 px-3.5 border-b border-dashed border-[#155daf]">
            <div className="items-center flex justify-between">
              <Link
                href="/"
                className="font-bold hover:opacity-85 transition-colors"
              >
                {sidebarOpen && (
                  <span>
                    Prime<span className="text-[#1e71d1]">Pack</span>
                  </span>
                )}
              </Link>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-md transition-all duration-300 cursor-pointer bg-[#155daf] shrink-0 overflow-hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div
              className={`flex flex-col gap-8 ${sidebarOpen ? "items-start" : "items-center"}`}
            >
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex flex-col items-center px-4 py-1.5 rounded-lg hover:text-white transition-colors duration-300 text-sm font-medium ${
                      isActive
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-[#8da9c4]"
                    }`}
                  >
                    {sidebarOpen ? item.label : item.icon}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-[#155daf] border-dotted">
            <div className="mb-4">
              <p className="text-xs text-[#8da9c4] uppercase tracking-wider">
                {sidebarOpen ? "Logged in as" : ""}
              </p>
              <p className="font-semibold text-sm tracking-wider capitalize">
                {sidebarOpen ? user?.username : user?.username?.[0]}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#13315C]">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 capitalize font-bold">
                {user?.username}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#155daf] text-white flex items-center justify-center text-sm font-bold">
                {user?.username?.[0].toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8">{children}</div>
        </div>
      </div>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center">
          <div className="relative bg-white max-w-xs w-full p-8 shadow-2xl rounded-xl">
            <div className="flex justify-center items-center mb-4">
              <div className="text-6xl">👋</div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-medium text-[#13315c] text-center">
                Do you want to
                <span className="text-red-600 font-bold"> Logout</span>
              </h2>

              <p className="text-center leading-relaxed mt-3 text-sm text-gray-600">
                Are you sure you want to logout? This action cannot be undone.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-7">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="border py-2 px-4 transition-all font-medium duration-300 text-[#13315c] active:scale-110 cursor-pointer rounded-xl shadow border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="border py-2 px-4 transition-all font-medium duration-300 active:scale-110 cursor-pointer rounded-xl shadow border-red-200 bg-red-50 text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
