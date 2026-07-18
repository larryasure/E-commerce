import { Heart, ShoppingCart, X } from "lucide-react";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cart } = useCart();

  const cartCount = cart?.total_items || 0

  const textLinkStyle = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors duration-200
     ${isActive ? "text-[#155daf]" : "text-slate-600 hover:text-[#155daf]"}`;

  const iconLinkStyle = ({ isActive }) =>
    `relative p-2 rounded-full transition-colors duration-200 hover:bg-slate-100
     ${isActive ? "text-[#155daf]" : "text-slate-600 hover:text-[#155daf]"}`;

  const userInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "";

  return (
    <>
      <nav className="fixed w-full top-0 z-20  bg-white/85 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <NavLink
            to="/"
            className="text-2xl font-extrabold tracking-tight text-[#13315c]"
          >
            Prime<span className="text-[#155daf]">Pack</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-4 bg-gray-100/70 px-3   py-1.5 rounded-xl">
            <div className="flex items-center gap-1">
              <NavLink to="/" className={textLinkStyle}>
                Home
              </NavLink>
              <NavLink to="/products" className={textLinkStyle}>
                Products
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/orders" className={textLinkStyle}>
                  Orders
                </NavLink>
              )}
            </div>

            <div className="flex items-center gap-1">
              <NavLink to="/wishlist" className={iconLinkStyle}>
                <div className=" flex items-center gap-1 ">
                  <Heart size={20} />
                  <span className="text-xs">wishlist</span>
                </div>
              </NavLink>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <NavLink to="/cart" className={iconLinkStyle}>
              <div className=" flex items-center gap-1 ">
                <div>
                  <ShoppingCart size={20} />
                  <span
                    className="
        absolute
        -top-1
        -right-1
        bg-red-500
        text-white
        text-[10px]

        h-4
        w-4
        rounded-full
        flex
        items-center
        justify-center
        "
                  >
                    {cartCount}
                  </span>
                </div>

                <span className="text-xs">Cart</span>
              </div>
            </NavLink>
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#155daf] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user?.username}
                  </span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#155daf]"
                  >
                    Profile
                  </NavLink>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-[#155daf] transition-colors"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-[#155daf] hover:bg-[#13315c] text-white px-5 py-2 rounded-full text-sm font-semibold transition shadow-sm"
                >
                  Get Started
                </NavLink>
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
                Are you sure you want to log out of your account? You will need
                to sign back in to view your orders.
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
