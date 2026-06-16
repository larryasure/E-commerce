import { X } from "lucide-react";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navLinkStyle = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-300
     ${isActive ? "text-blue-500" : "text-slate-700 hover:text-blue-500"}`;

  return (
    <>
      <nav className="sticky  top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-extrabold tracking-tight text-slate-900"
          >
            Prime<span className="text-blue-500">Pack</span>
          </NavLink>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100/70 px-4 py-1 rounded-2xl">
            <NavLink to="/" className={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkStyle}>
              Products
            </NavLink>

            <NavLink to="/cart" className={navLinkStyle}>
              Cart
            </NavLink>

            <NavLink to="/wishlist" className={navLinkStyle}>
              Wishlist
            </NavLink>

            {isAuthenticated && (
              <NavLink to="/orders" className={navLinkStyle}>
                Orders
              </NavLink>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>

                  <span className="text-sm font-medium text-slate-700">
                    {user?.username}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                  <NavLink
                    to="/profile"
                    className="block px-5 py-3 text-sm hover:bg-slate-50"
                  >
                    Profile
                  </NavLink>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full text-left px-5 py-3 text-sm hover:bg-red-50 hover:text-red-500 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-blue-500 transition"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-md hover:shadow-lg"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center ">
          <div className="relative bg-white max-w-sm w-full p-8 shadow-2xl rounded-xl ">
            <div className="flex justify-end items-center">
              <div
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-red-300 transition-all duration-300 cursor-pointer active:scale-110 bg-red-200 w-10 h-10 rounded-full flex justify-center items-center  "
              >
                <X />
              </div>
            </div>

            <div className="mt-8 ">
              <h2 className="text-2xl font-medium text-[#13315c] text-center">
                Are you sure you want to{" "}
                <span className="text-red-600 font-bold"> Logout</span>
              </h2>

              <p className="text-center leading-relaxed  mt-3">
                Are you sure you want to logout? This action cannot be undone.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-7  ">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="border py-2 px-4 transition-all font-medium duration-300 text-[#13315c] active:scale-110 cursor-pointer rounded-xl shadow border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsModalOpen(false);
                  }}
                  className="border py-2 px-4 transition-all font-medium duration-300 active:scale-110 cursor-pointer rounded-xl shadow border-red-200 bg-red-50 text-red-600"
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
