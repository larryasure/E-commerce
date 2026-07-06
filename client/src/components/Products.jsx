import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import ProductCard from "./ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(parseInt(categoryFromUrl));
    }
  }, [categoryFromUrl]);

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
      !selectedCategory || product.category?.id === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="mb-12 ">
            <h1 className="text-4xl font-bold text-[#13315c] mb-4 ">
              Our Products
            </h1>
            <p className="text-lg text-gray-600">
              Discover our complete collections of premium items
            </p>
          </div>

          <div className="shadow-lg p-8 bg-white rounded-xl mb-8 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <input
                type="text"
                placeholder="Search Products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#13315c] focus:outline-0 focus:ring-1 focus:ring-[#155daf] transition-all duration-300"
              />

              <select
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value ? parseInt(e.target.value) : null,
                  )
                }
                value={selectedCategory || ""}
                className="px-4 py-3 border border-[#13315c] focus:outline-none focus:ring-1 focus:ring-[#155daf] transition-all duration-300"
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155daf]"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  variant="list"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
