import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesRes, featuredRes] = await Promise.all([
          axiosInstance.get("products/"),
          axiosInstance.get("categories/"),
        ]);
        setFeaturedProducts(featuredRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to load homepage", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return <></>;
}
