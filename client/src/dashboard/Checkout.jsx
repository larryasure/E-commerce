import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();

  const { user, loading } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [formData, setFormData] = useState({ shippingAddress: "" });
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user?.profile?.address) {
        setFormData({ shippingAddress: user.profile.address });
      }
      setIsReady(true);
    }
  }, [user, loading]);

  const total = cartItems.reduce((sum, item) => item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.taget.value;
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
      const orderTotal = {
        totalPrice: total,
        shipping_address: formData.shippingAddress,
      };

      await axiosInstance.get("cart/", orderTotal);
      localStorage.removeItem("cart");
      setSuccess("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      setErrors({ submit: error.response?.detail || "Failed to place order" });
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
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 ">
          <p className="text-center text-gray-600 text-lg font-semibold">
            Cart is empty
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 ">
          <h2 className="text-3xl font-bold text-[#13315c] mb-8  ">Checkout </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-lg animate-fadeInOut">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  
                </form>

              </div>
              
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
