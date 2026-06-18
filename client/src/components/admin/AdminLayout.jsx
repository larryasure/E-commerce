import {
  Layers,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import avatar from "../../assets/Hero banner/Avatar.jpg";
import logoutImage from "../../assets/Hero banner/logout2.jpg";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/products");
  };

  const menuItems = [
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

  return (
    <>
      <div className="min-h-screen flex bg-gray-50">
        <div
          className={`${
            sidebarOpen ? "w-42" : "w-24"
          } bg-[#13315C] text-white transition-all duration-300 flex flex-col`}
        >
          <div className="py-4.5 px-3.5 border-b border-dashed border-[#155daf]">
            <div className="items-center flex justify-between ">
              <Link
                to="/"
                className=" font-bold hover:opacity-85 transition-colors"
              >
                {sidebarOpen && (
                  <span>
                    Prime<span className="text-[#1e71d1]">Pack</span>
                  </span>
                )}
              </Link>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-md transition-all duration-300 cursor-pointer bg-[155daf] shrink-0 overflow-hidden "
              >
                {sidebarOpen ? (
                  <X />
                ) : (
                  <div className="items-center flex flex-col w-full ">
                    <Menu />
                  </div>
                )}
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 ">
            <div
              className={`flex flex-col gap-8 ${sidebarOpen ? "items-start" : "items-center"}`}
            >
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center rounded-lg hover:text-[#155daf] transition-colors duration-300 text-sm font-medium"
                >
                  {sidebarOpen ? item.label : item.icon}
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-[#155daf] border-dotted">
            <div className="mb-4">
              <p className="text-xs text-[#8da9c4] uppercase tracking-wider">
                {sidebarOpen ? "Logged in as" : ""}
              </p>
              <p className="font-semibold text-sm tracking-wider capitalize">
                {sidebarOpen ? user?.username : user?.username}
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
              <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8">
            <Outlet />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center ">
          <div className="relative bg-white max-w-xs w-full p-8 shadow-2xl rounded-xl ">
            <div className="flex justify-center items-center">
              <div>
                <img className="h-15 w-15" src={logoutImage} alt="logout" />
              </div>
            </div>

            <div className="mt-8 ">
              <h2 className="text-2xl font-medium text-[#13315c] text-center">
                Do you want to
                <span className="text-red-600 font-bold "> Logout</span>
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
