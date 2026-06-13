import { useState } from "react";
import axiosInstance from "../api/axiosConfig";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useState(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("products/"),
          axiosInstance.get("categories/"),
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 9));
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to load Homepage data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);


  

  return <div></div>;
}
