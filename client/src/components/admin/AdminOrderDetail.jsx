import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get(`/orders/${id}/`);
      setOrder(response.data);
      setNewStatus(response.data.order_status);
    } catch (error) {
      console.error("Failed to load order", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);

    try {
      await axiosInstance.patch(`/orders/${id}/`, {
        order_status: newStatus,
      });
      setOrder({ ...order, order_status: newStatus });
      alert("Order status updated");
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155daf]"></div>
      </div>
    );
  }

  if (!order) {
    return <p className="text-center text-gray-600">Order not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/admin/orders")}
        className="text-[#155daf] hover:text-[#13315C] font-semibold"
      >
        ← Back to Orders
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#13315C] mb-2">
            Order #{order.id}
          </h1>
          <p className="text-gray-600">
            {new Date(order.created_at).toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-[#13315C] mb-4">Customer</h3>
            <p className="text-gray-600 mb-2">
              <strong>Name:</strong> {order.user?.username || "Guest"}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {order.user?.email || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#13315C] mb-4">
              Shipping Address
            </h3>
            <p className="text-gray-600">{order.shipping_address}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8 border-t pt-8">
          <h3 className="text-lg font-bold text-[#13315C] mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-[#13315C]">
                    {item.product?.name}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-[#155daf]">${item.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-lg font-bold text-[#13315C] mb-4">
            Update Status
          </h3>
          <div className="flex gap-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-[#155daf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155daf]"
            >
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELED">Canceled</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === order.order_status}
              className="bg-[#155daf] text-white px-8 py-3 rounded-lg hover:bg-[#13315C] disabled:bg-gray-400 font-semibold transition-colors"
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        <div className="border-t pt-8 mt-8">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-[#13315C]">Total</span>
            <span className="text-3xl font-bold text-[#155daf]">
              ${order.total_Price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
