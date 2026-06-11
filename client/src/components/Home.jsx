import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("products/");
        setFeaturedProducts(response.data.slice(0, 9));
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  
  return <div></div>;
}
