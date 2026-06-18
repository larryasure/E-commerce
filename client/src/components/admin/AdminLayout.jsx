import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/products");
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Products", path: "/admin/products" },
    { label: "Categories", path: "/admin/categories" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Users", path: "/admin/users" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div
        className={`${
          sidebarOpen ? "w-54" : "w-24"
        } bg-[#13315C] text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-[#155daf]">
          <Link
            to="/"
            className="text-2xl font-bold hover:text-[#8da9c4] transition-colors"
          >
            {sidebarOpen && "PrimePack"}
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-3 rounded-lg hover:bg-[#155daf] transition-colors duration-300 text-sm font-medium"
            >
              {sidebarOpen ? item.label : item.label.charAt(0)}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#155daf]">
          <div className="mb-4">
            <p className="text-xs text-[#8da9c4] uppercase tracking-wider">
              {sidebarOpen ? "Logged in as" : ""}
            </p>
            <p className="font-semibold text-sm">
              {sidebarOpen ? user?.username : user?.username?.charAt(0)}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            {sidebarOpen ? "Logout" : "X"}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-4 border-t border-[#155daf]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full hover:bg-[#155daf] px-4 py-2 rounded-lg transition-colors"
          >
            {sidebarOpen ? "← Collapse" : "→"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#13315C]">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 ca">{user?.username}</span>
            <img
              src={`https://via.placeholder.com/40x40?text=${user?.username}`}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
