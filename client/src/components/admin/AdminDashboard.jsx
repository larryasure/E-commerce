import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";


const StatCard = ({ label, value, color }) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-8 border-t-2 border-b-2 text-center  hover:shadow-xl duration-300 transition-all ${color}`}
  >
    <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
    <p className="text-4xl font-bold text-[#13315C]">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productRes, categoryRes, orderRes, userRes] = await Promise.all([
          axiosInstance.get("products/"),
          axiosInstance.get("categories/"),
          axiosInstance.get("orders/"),
          axiosInstance.get("users/"),
        ]);

        setStats({
          totalProducts: productRes.data.length,
          totalCategories: categoryRes.data.length,
          totalOrders: orderRes.data.length,
          totalUsers: userRes.data.length,
        });
      } catch (error) {
        console.error("Failed to load Stats", error)
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-[#13315c] border-b-3 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen space-y-8">
        <div>
          <h2 className="text-2xl font-medium text-[#13315c]">
            Welcome Admin{" "}
            <span className=" text-gray-800 capitalize">{user?.username}.</span>
          </h2>
          <p className="text-lg text-gray-600">Manage your Website.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  ">
          <StatCard
            label="Total Products"
            value={stats.totalProducts}
            color="border-[#155daf] "
          />
          <StatCard
            label="Total Categories"
            value={stats.totalCategories}
            color="border-green-500  "
          />
          <StatCard
            label="Total Orders"
            value={stats.totalOrders}
            color="border-orange-500 "
          />
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            color="border-purple-500 "
          />
        </div>

        <div className="bg-white rounded-xl max-w-md mx-auto shadow-lg p-8">
          <h2 className="text-xl font-bold text-[#13315C] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Changed to Link and 'to' */}
            <NavLink
              to="/admin/products/new"
              className="bg-[#155daf] text-white px-6 py-3 rounded-lg hover:bg-[#13315C] transition-colors font-semibold text-center"
            >
              Add New Product
            </NavLink>

            {/* 2. Changed to Link and 'to' */}
            <NavLink
              to="/admin/categories/"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
            >
              Add New Category
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
