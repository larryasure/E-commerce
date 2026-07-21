import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function Cart() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const { cart, increaseCart, decreaseCart, removeCart } = useCart();
  const total = cart?.total || 0
  const shipping = cart?.shipping || 0
  const subtotal = cart?.subtotal || 0
  const grandTotal = cart?.grand_total || 0
  




  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen py-12 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#13315C] mb-8">
            Shopping Cart
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-8">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-[#155daf] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#13315C] transition-all duration-300 transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <h1 className="text-4xl font-bold text-[#13315C] mb-6">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {cart?.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-6 flex items-center justify-between border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-[#13315C] mb-2">
                      {item.product.name}
                    </h3>

                    <p className="text-[#155daf] font-semibold text-xs">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-[#155daf] rounded-lg">
                      <button
                        onClick={() => decreaseCart(item.id)}
                        className="px-2 py-1 hover:bg-[#155daf]/10"
                      >
                        −
                      </button>

                      <span className="px-2 py-1.5 font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseCart(item.id)}
                        className="px-2 py-1 hover:bg-[#155daf]/10"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold  text-[#13315C] w-24 text-right text-sm">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>

                    <button
                      onClick={() => removeCart(item.id)}
                      className="text-red-500 text-sm hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20 space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-xl font-bold text-[#13315C] mb-6">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-sm">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-[#13315c] text-sm">
                    {shipping === 0 ? (
                      <span className="text-green-500  ">Free</span>
                    ) : (
                      <span>{formatCurrency(shipping)}</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-[#13315C]">Total</span>
                <span className="text-lg font-bold text-[#155daf] tracking-wider">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <button
                onClick={() =>
                  isAuthenticated ? navigate("/checkout") : navigate("/login")
                }
                className="w-full bg-[#155daf] text-white py-4 rounded-lg font-bold hover:bg-[#13315C] transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
              </button>

              <Link
                to="/products"
                className="block w-full text-center text-[#155daf] hover:text-[#13315C] font-semibold transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
