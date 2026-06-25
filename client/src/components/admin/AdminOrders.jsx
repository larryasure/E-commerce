import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get("orders/");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to load Orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.order_status === filterStatus)
    : orders;

  const getStatusColor = (status) => {
    switch (status) {
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-500";
      case "CANCELED":
        return "bg-red-100 text-red-500";
      default:
        return "bg-red-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 ">
        <div className="w-12 h-12 border-b-2 border-[#13315c]  rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-x-6 ">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#13315C] mb-6">Orders</h1>
          <div className="">
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-[#155daf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155daf]"
              >
                <option value="">All Orders</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
}
