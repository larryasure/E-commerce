import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { formatCurrency } from "../utils/formatCurrency";

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("orders/");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-600";
      case "SHIPPED":
        return "bg-blue-100 text-blue-600";
      case "DELIVERED":
        return "bg-green-100 text-green-600";
      case "CANCELED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-b-2 border-[#13315c] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-22">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#13315c] mb-8">My Orders</h1>
          <div className="bg-white shadow-xl rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              You haven't placed any orders yet
            </p>
            <NavLink
              to="/products"
              className="inline-block bg-[#155daf] text-white px-6 py-3 rounded-lg hover:bg-[#13315C] transition-colors font-semibold"
            >
              Start Shopping
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold text-[#13315c] my-10">My Orders</h2>
        <div className="space-y-8">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-200 animation-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b">
                  <div>
                    <h3 className="text-[#13315c] font-semibold">Order {order.order_number}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${getStatusColor(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-[#13315c] mb-4">Items</h4>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div
                        className="flex items-center bg-gray-50 p-4 rounded-lg justify-between"
                        key={item.id}
                      >
                        <div>
                          <p className="text-[#13315c] font-medium">
                            {item.product?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-black text-[#155daf]">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b">
                  <div>
                    <p className="text-sm mb-1 text-gray-600">Shipping Address</p>
                    <p className="text-[#13315c] font-semibold">
                      {order.order_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Order Status</p>
                    <p className="text-[#13315c] font-medium">
                      {order.order_status}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center items-start gap-6 justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Order Price</p>
                    <p className="font-semibold text-[#155daf]">
                      {formatCurrency(order.total_price)}
                    </p>
                  </div>
                  <NavLink
                    to={`/order-detail/${order.id}`}
                    className="bg-[#155daf] text-white font-medium hover:bg-[#13315c] transition-all duration-300 rounded-lg px-6 py-2"
                  >
                    View Details
                  </NavLink>
                </div>
              </div>

              <div className="bg-gray-50 p-6 border-t border-gray-100">
                <p className=" text-gray-600 uppercase tracking-wide font-semibold mb-4">
                  Tracking
                </p>
                <div className="flex items-center justify-between w-full max-w-lg mx-auto">
                  <div className="flex items-center flex-col z-10">
                    <div className="w-6 h-6 flex items-center justify-center font-medium text-xs text-white bg-green-500 rounded-full shadow">
                      ✓
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">Ordered</p>
                  </div>

                  <div
                    className={`flex-1 h-1 mx-2 -mt-5 transition-colors duration-300 ${
                      ["SHIPPED", "DELIVERED"].includes(order.order_status)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>

                  <div className="flex flex-col items-center z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                        ["SHIPPED", "DELIVERED"].includes(order.order_status)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {["SHIPPED", "DELIVERED"].includes(order.order_status) ? "✓" : "○"}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">Shipped</p>
                  </div>

                  <div
                    className={`flex-1 h-1 mx-2 -mt-5 transition-colors duration-300 ${
                      order.order_status === "DELIVERED"
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>

                  <div className="flex items-center flex-col z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                        order.order_status === "DELIVERED"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {order.order_status === "DELIVERED" ? "✓" : "○"}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">Delivered</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
