import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();

  const { user, loading } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [formData, setFormData] = useState({ shippingAddress: "" });
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false)
  

  return <div></div>;
}
