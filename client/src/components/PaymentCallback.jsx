import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

export default function PaymentCallback() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transaction_id = searchParams.get("transaction_id");
        const tx_ref = searchParams.get("tx_ref");

        if (!transaction_id || !tx_ref) {
          setStatus("failed");
          setMessage("Invalid payment information.");
          setLoading(false);
          return;
        }
        const order_number = tx_ref.replace("Order-", "");

        const response = await axiosInstance.post("verify/payment", {
          transaction_id,
          order_number,
        });
        setStatus(response.data.status);
        setMessage(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setStatus("Failed");
        setMessage("Unable to verify payment");
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-12 h-12 border-b-4 border-[#155daf] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-[#13315c]">
            Verifying Payment...
          </h2>
          <p className="text-gray-500 mt-2 ">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="max-w-md bg-white shadow-lg rounded-xl  p-8 text-center">
          <h1 className="text-3xl font-bold text-green-600 ">
            Payment Successful
          </h1>
          <p className="text-gray-600 mt-4">{message}</p>

          <button
            onClick={() => navigate("/orders")}
            className="text-white px-4 py-2 rounded-lg font-medium mt-2 bg-[#155daf]"
          >
            View Order
          </button>
        </div>
      </div>
    );
  }

  if (status === "Failed ") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg p-8 text-center rounded-xl">
          <h1 className="text-3xl font-bold text-red-500">Payment Failed</h1>
          <p className="text-gray-600 mt-4">{message}</p>
          <button className="py-2 px-4 bg-[#13315c] text-white hover:bg-[#155daf] mt-2 rounded-lg ">
            Retry{" "}
          </button>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-yellow-500 ">
            Payment Pending
          </h1>
          <p className="text-gray-600 mt-4">{message}</p>
        </div>
      </div>
    );
  }

  return <div>{message}</div>;
}
