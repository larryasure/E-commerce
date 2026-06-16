import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Cart() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]"),
  );

  const updatedQuatity = (id, newQuantity) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quatity: Math.max(1, newQuantity) } : item,
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quatity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="py-12 min-h-screen ">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 ">
          <h1 className="text-4xl font-bold mb-8 text-[#13315c]">
            Start Shopping{" "}
          </h1>
          <div className="p-12 text-center bg-white rounded-xl shadow-lg ">
            <p className="text-gray-600 text-lg font-medium mb-6 ">
              Your Cart is empty
            </p>
            <Link
              to="/products"
              className="bg-[#155daf] text-white font-semibold px-7 py-2 transition-all duration-300 rounded-xl hover:bg-[#13315c] transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="py-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg-:px-8 ">
          <h1 className="text-xl font-bold text-[#13315c] mb-8 ">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
