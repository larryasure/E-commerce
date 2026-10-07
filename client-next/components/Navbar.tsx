"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, token, logout, hydrate } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname()

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const cartCount = cart?.total_items || 0;

  if(pathname.startsWith("/admin")) return null

  return (
    <>
      <nav className="fixed w-full top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-[#13315c]"
          >
            Prime<span className="text-[#155daf]">Pack</span>
          </Link>

          <div className="hidden md:flex items-center gap-4 bg-gray-100/70 px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#155daf] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#155daf] transition-colors"
              >
                Products
              </Link>
              {user && (
                <Link
                  href="/orders"
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#155daf] transition-colors"
                >
                  Orders
                </Link>
              )}

              {user?.is_staff && (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#155daf] transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#155daf] transition-colors"
            >
              <div className="flex items-center gap-1">
                <Heart size={20} />
                <span className="text-xs hidden sm:inline">Wishlist</span>
              </div>
            </Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#155daf] transition-colors"
            >
              <div className="flex items-center gap-1">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
                <span className="text-xs hidden sm:inline">Cart</span>
              </div>
            </Link>

            {user ? (
              <div ref={dropDownRef} className="relative">
                <button
                  onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#155daf] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {user.username?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                    {user.username}
                  </span>
                </button>

                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 transition-all duration-300 ${
                    isDropDownOpen
                      ? "visible opacity-100"
                      : "invisible opacity-0"
                  }`}
                >
                  <Link
                    href="/profile"
                    onClick={() => setIsDropDownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#155daf]"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsDropDownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-slate-600 hover:text-[#155daf] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#155daf] hover:bg-[#13315c] text-white px-5 py-2 rounded-full text-sm font-semibold transition shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white max-w-sm w-full p-6 shadow-2xl rounded-xl border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#13315c]">
                Confirm Logout
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-slate-100 p-1.5 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3">
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to log out?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsModalOpen(false);
                  }}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-sm font-medium text-white rounded-lg transition-colors shadow-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
