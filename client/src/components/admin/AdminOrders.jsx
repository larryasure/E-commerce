import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";

import { NavLink } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [activeDeleteId, setActiveDeleteId] = useState(null)
   
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
    };``
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

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`orders/${id}/`);
      setOrders((prev) => prev.filter((order) => order.id !== id));
      setActiveDeleteId(null)
    } catch (error) {
      console.error("Failed to delete Order:", error);
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
                className="px-6 py-2 border-2 border-[#155daf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155daf]"
              >
                <option value="">All Orders</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md">
            <table className="w-full">
              <thead className="text-white bg-[#13315c]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-left text-sm">
                    Order ID
                  </th>
                  <th className="px-6 py-4 font-semibold text-left text-sm">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-semibold text-left text-sm">
                    Total
                  </th>
                  <th className="px-6 py-4 font-semibold text-left text-sm">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-left text-sm">
                    Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-left text-sm">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      className="bg-gray hover:bg-gray-50 duration-300 transition-all"
                      key={order.key}
                    >
                      <td className="text-[#13315c] py-4 px-6 font-medium">
                        Order {order.order_number}
                      </td>
                      <td className="text-gray-600 py-4 px-6 font-medium capitalize ">
                        {order.user?.username || "Guest"}
                      </td>
                      <td className="text-[#155daf]">
                        {formatCurrency(order.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
                            order.order_status,
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date (order.created_at).toDateString()}
                      </td>
                      
                      <td className="px-6 py-4 flex items-center gap-3">
                        <NavLink
                          end
                          to={`/admin/orders/${order.id}`}
                          className="text-[#155daf] hover:text-[#13315C] font-semibold"
                        >
                        View
                        </NavLink>

                        <td className="text-red-500 cursor-pointer " onClick={() => setActiveDeleteId(order.id)} >
                          Delete
                        </td>
                      </td>


                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-[#13315c]">
                      No Order found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

          {activeDeleteId && (
        <div className="fixed bg-black/60 flex items-center justify-center inset-0 backdrop-blur-xs  ">
          <div className="flex  flex-col bg-white rounded-xl shadow-md p-8  max-w-xs  w-full">
            <h2 className="text-2xl text-[#13315c] font-bold ">
              Delete Order
            </h2>

            <div className="flex items-start mt-4">
              <p className="tracking-wide  ">
                Are you sure you want to delete this Order ?
              </p>
            </div>

            <div className="mt-7 grid  grid-cols-2 gap-12 ">
              <button
                onClick={() => setActiveDeleteId(null)}
                className="font-medium bg-[#13315c]  text-white cursor-pointer p-2 rounded-lg hover:bg-[#155daf] transition-all duration-300 "
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(activeDeleteId)}
                className="font-medium text-[#13315c] bg-red-200 rounded-lg  p-2 hover:text-white hover:bg-red-600 transition-all duration-300 cursor-pointer "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
