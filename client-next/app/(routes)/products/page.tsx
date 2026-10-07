"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/api/client";

import { ProductSerializer, CategorySerializer } from "@/lib/types";
import { Search } from "lucide-react";
import ProductCard from "@/components/productCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductSerializer[]>([]);
  const [categories, setCategories] = useState<CategorySerializer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    parseInt(searchParams.get("category") || "0") || null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all([
          axiosInstance.get("/products").catch((err) => {
            console.error("Products endpoint failed:", err);
            return null;
          }),
          axiosInstance.get("/categories").catch((err) => {
            console.error("Categories endpoint failed:", err);
            return null;
          }),
        ]);

        const productsRes = responses[0] as {
          data?: ProductSerializer[] | { results?: ProductSerializer[] };
        } | null;
        const categoriesRes = responses[1] as {
          data?: CategorySerializer[] | { results?: CategorySerializer[] };
        } | null;

        const productsList = Array.isArray(productsRes?.data)
          ? productsRes.data
          : Array.isArray(productsRes?.data?.results)
            ? productsRes.data.results
            : Array.isArray(
                  (productsRes as { results?: ProductSerializer[] } | null)
                    ?.results,
                )
              ? ((productsRes as { results?: ProductSerializer[] }).results ??
                [])
              : [];

        const categoriesList = Array.isArray(categoriesRes?.data)
          ? categoriesRes.data
          : Array.isArray(categoriesRes?.data?.results)
            ? categoriesRes.data.results
            : Array.isArray(
                  (categoriesRes as { results?: CategorySerializer[] } | null)
                    ?.results,
                )
              ? ((categoriesRes as { results?: CategorySerializer[] })
                  .results ?? [])
              : [];

        setProducts(productsList);
        setCategories(categoriesList);
      } catch (error: any) {
        console.error("Failed to load products page data:", error);
        setError(error.message || "An unexpected error occurred.");
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
    <div className="min-h-screen py-12 mt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="sm:text-3xl text-xl font-bold text-[#13315c] mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            Discover our complete collections of premium items
          </p>
        </div>

        <section className="shadow-lg p-8 bg-white rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search Products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-4 py-2 rounded-lg border border-[#13315c] focus:outline-0 focus:ring-1 focus:ring-[#155daf] transition-all duration-300"
              />
            </div>

            <select
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              value={selectedCategory || ""}
              className="px-4 py-2 border border-[#13315c] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155daf] transition-all duration-300"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-infinity loading-xl"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
