"use client";

import { axiosInstance } from "@/lib/api/client";
import { CategorySerializer, ProductSerializer } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter()

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [product, setProduct] = useState<ProductSerializer | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [categories, setCategories] = useState<CategorySerializer[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/");
        setCategories(response.data.results || response.data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);

        setProduct(response.data);
        setDescription(response.data.description);
        setName(response.data.name);
        setPrice(String(response.data.price));
        setOriginalPrice(
          response.data.original_price
            ? String(response.data.original_price)
            : "",
        );
        setStock(String(response.data.stock || 0));
        setCategoryId(String(response.data.category?.id || ""));
        setIsActive(response.data.is_active ?? true);
        setFeatured(response.data.featured ?? false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);


  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("original_price", originalPrice);
      formData.append("stock", stock);
      formData.append("category_id", categoryId);
      formData.append("is_active", String(isActive));
      formData.append("featured", String(featured));

      if (image) {
        formData.append("image", image);
      }
      await axiosInstance.patch(`/products/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully");

      router.push("/admin/products");
    } catch (error: any) {
      console.error("UPDATE PRODUCT ERROR:", error.response?.data);

      toast.error(
        JSON.stringify(error.response?.data || "Failed to update product"),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80  p-6 rounded-md  max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-600 font-medium text-sm">Loading Products</p>
          <span className="loading loading-dots loading-md text-gray-500"></span>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <>
      <div className="  max-w-lg mx-auto p-4 rounded-xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#13315c]">Edit Product</h2>

          <p className="text-[#155daf] font-medium tracking-wide hover:translate-x-1.5">
            {product.name}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          action=""
          className="space-y-2 mt-4 bg-white rounded-md shadow-xl p-6 "
        >
          <div>
            <label className="block text-sm font-medium text[#13315c] mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="input input-bordered w-full rounded-md transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#13315c] mb-2 ">
              Product Description
            </label>

            <textarea
              className="textarea textarea-bordered w-full rounded-md transition-all duration-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#13315c] mb-2">
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#13315c] mb-2">
                Original Price
              </label>

              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="0"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#13315c] mb-2">
              Stock
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#13315c] mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#13315c] mb-2">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="checkbox"
              />

              <span className="font-medium text-[#13315c]">Active Product</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="checkbox"
              />

              <span className="font-medium text-[#13315c]">
                Featured Product
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn bg-[#155daf] text-white font-medium border-none hover:bg-[#13315c] my-3"
          >
            {loading ? (
              <div className="inline-flex gap-3 ">
                <span>Updating Product</span>
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : (
              <span>Update Product</span>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
