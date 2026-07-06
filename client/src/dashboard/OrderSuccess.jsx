import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { formatCurrency } from "../utils/formatCurrency";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = axiosInstance.get(`orders/${orderId}/`);
        setOrder((await response).data);
      } catch (error) {
        console.error("Failed to load ordes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [navigate, orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 ">
        <div className="w-12 h-12 border-b-2 border-[#13315c] rounded-full animate-spin "></div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="py-12 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto ">
          <p className="text-center text-lg  text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen py-12 bg-gray-50 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="bg-white p-8 shadow-xl sm:p-12 rounded-xl animate-fadeInUp">
            <div className="flex justify-center my-6">
              <div className="bg-green-200 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M6 15l4 4L20 8"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-black text-[#13315c] mb-4 ">
              Order Confirmed!
            </h1>

            <p className="text-lg text-gray-600  mb-8 ">
              Thank you for your purchase. Your order has been placed
              successfully.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-8 ">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600 ">Order ID</span>
                <span className="font-bold text-[#13315c]">
                  {formatCurrency(order.order_id)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-4 ">
                <span className="text-gray-600">Order Date</span>
                <span className="font-bold text-[#13315c]">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between ">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-[#13315c] font-bold ">
                  {formatCurrency(order.total_price)}
                </span>
              </div>
            </div>

            <div className="mb-8 text-left">
              <h3 className="text-lg font-bold text-[#13315c] mb-4">
                Order Items
              </h3>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="text-[#13315c] font-semibold">
                        {item.product?.name}
                      </p>
                      <p className="text-sm text-gray-600 ">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-[#13315c]">
                      {formatCurrency(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-lg font-bold text-[#13315C] mb-3">
                Shipping Address
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {order.shipping_address}
              </p>
            </div>
          </div>

          <div className="bg-green-50 border rounded-xl p-6 border-green-200 mb-6">
            <p className="text-green-600 font-semibold">
              A Confirmation email has been sent to your email address
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-lg font-bold text-[#13315C] mb-4">
              What's Next?
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-[#155daf] font-bold">1.</span>
                <span>
                  We'll process your order and prepare it for shipment.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#155daf] font-bold">2.</span>
                <span>
                  You'll receive a tracking number via email once shipped.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#155daf] font-bold">3.</span>
                <span>
                  Track your order status anytime in your Orders dashboard.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <NavLink
              to="/order"
              className="flex-1 bg-[#155daf] text-white py-4 rounded-lg hover:bg-[#13315C] font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 text-center"
            >
              Track Your Order
            </NavLink>
            <NavLink
              to="/products"
              className="flex-1 border-2 border-[#155daf] text-[#155daf] py-4 rounded-lg hover:bg-[#155daf] hover:text-white font-bold transition-all duration-300 text-center"
            >
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
