import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export default function Products() {
  const [products, setProducts] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTern] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productRes] = await Promise.all([
          axiosInstance.get("categories/"),
          axiosInstance.get("products/"),
        ]);
        setCategories(categoriesRes.data);
        setProducts(productRes.data);
      } catch (error) {
        console.error("Failed to load homepage", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);




  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category.id === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return <></>;
}
