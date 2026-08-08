import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

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

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) => {
        const matchesTab =
          activeTab === "All" || order.order_status === activeTab.toUpperCase();

        const matchesSearch = order.order_number
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchesTab && matchesSearch;
      },
      [orders, activeTab, search],
    );
  });

  if (loading) {
    return <div className="flex items-center justify-center h-96"></div>;
  }

  return <div>Orders</div>;
}
