import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function Checkout() {
  const navigate = useNavigate();

  const { user, loading } = useContext(AuthContext);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [formData, setFormData] = useState({ shippingAddress: "" });
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [success, setSuccess] = useState("");
  const { cart, clearCart } = useCart();

  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const grandtotal = cart?.grand_total || 0;

  useEffect(() => {
    if (!loading) {
      if (user?.profile?.address) {
        setFormData({ shippingAddress: user.profile.address });
      }
      setIsReady(true);
    }
  }, [user, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleValidate = () => {
    const newErrors = {};
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = "Shipping address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidate()) return;
    setCheckoutLoading(true);

    try {
      const orderResponse = await axiosInstance.post("orders/", {
        shipping_address: formData.shippingAddress,
      });

      const orderId = orderResponse.data.id;

      const paymentResponse = axiosInstance.post("payments/initialize/", {
        order_id: orderId,
      });

      window.location.href = paymentResponse.data.payment_link
    } catch (error) {
      setErrors({
        submit: error.response?.data?.detail || "Failed to place order",
      });
      console.log(error.response?.data);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading || !isReady) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen">
        <div className="w-12 h-12 border border-b-2 border-[#13315c] animate-spin rounded-full"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12 ">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 my-10">
          <p className="text-center text-gray-600 text-lg font-semibold">
            Cart is empty
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#13315c] mb-8">Checkout</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="font-medium text-[#155daf] text-sm block mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    name="shippingAddress"
                    rows="3"
                    placeholder="Enter your shipping address"
                    className={`px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring transition-all duration-300 placeholder:text-sm ${
                      errors.shippingAddress
                        ? "border-red-500 focus:ring-red-500"
                        : "border-[#155daf] focus:ring-[#155daf]"
                    }`}
                  ></textarea>
                  {errors.shippingAddress && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.shippingAddress}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-[#13315c] mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        className="flex items-center justify-between p-4 bg-sky-50 rounded-lg"
                        key={item.id}
                      >
                        <div>
                          <p className="text-sm font-medium text-[#13315c]">
                            {item.product?.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-[#155daf] text-sm tracking-wider font-medium">
                          {formatCurrency(item?.product?.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-100 text-red-500 p-2 rounded-lg border border-red-300 text-sm">
                    {errors.submit}
                  </div>
                )}
                {success && (
                  <p className="text-sm text-green-500 bg-green-100 p-2 rounded-lg">
                    {success}
                  </p>
                )}

                <button
                  className="w-full bg-[#155daf] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#13315C] disabled:bg-gray-400 transition-all duration-300"
                  disabled={checkoutLoading}
                  type="submit"
                >
                  {checkoutLoading ? "Processing..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-20">
              <h2 className="text-[#13315c] font-semibold text-lg mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-sm font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-500 font-semibold">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="font-bold text-[#13315C] text-lg">Total</span>
                <span className="text-xl tracking-wider font-bold text-[#155daf]">
                  {formatCurrency(grandtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
