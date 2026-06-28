import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axiosInstance.get("/categories/");
        setCategories(categoriesRes.data);

        if (id) {
          const productRes = await axiosInstance.get(`/products/${id}/`);
          setFormData({
            name: productRes.data.name,
            slug: productRes.data.slug,
            description: productRes.data.description,
            price: productRes.data.price,
            stock: productRes.data.stock,
            category_id: productRes.data.category.id,
            is_active: productRes.data.is_active,
          });
        }
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.stock.trim()) newErrors.stock = "Stock is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: formData.price,
        stock: formData.stock || 0,
        category: formData.category_id,
        is_active: formData.is_active,
      };

      if (id) {
        await axiosInstance.put(`products/${id}/`, data);
        alert("Product updated successfully");
      } else {
        await axiosInstance.post("products/", data);
        navigate("admin/product");
      }

      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      
      console.error(error.response?.data);
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        <h1 className="text-[#13315c] text-3xl font-bold mb-5 ">
          {id ? "Edit Products" : "Add new Products"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-white rounded-xl shadow-xl p-4"
        >
          <div>
            <label className="font-semibold mb-2 text-[#155daf] text-sm ">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 focus:ring focus:ring-[#13315c] focus:outline-none border border-[#13315c] rounded-xl transition-all duration-300 ${errors.name ? "border-red-500 focus:ring-red-500" : "border-[#155daf] focus:ring-[#155daf] "}`}
            />

            {errors.name && (
              <span className="text-red-500 text-xs  mt-1">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="text-sm text-[#155daf] font-semibold mb-2 ">
              Slug
            </label>

            <input
              type="text"
              value={formData.slug}
              onChange={handleChange}
              name="slug"
              className={`w-full px-4 py-2 focus:ring focus:ring-[#13315c] focus:outline-none border border-[#13315c] rounded-xl transition-all duration-300 ${errors.slug ? "border-red-500 focus:ring-red-500" : "border-[#155daf] focus:ring-[#155daf] "}`}
            />
            {errors.slug && (
              <span className="text-xs text-red-500 mt-1">{errors.slug}</span>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#155daf] font-semibold">
              Category
            </label>

            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-[#13315c] focus:ring focus:outline-none transition-all duration-300 focus:ring-[#13315c] rounded-xl ${errors.category_id ? "border-red-500 focus:ring-offset-red-500" : "focus:ring-[#155daf] border-[#155daf]"} `}
            >
              <option value="" disabled>
                Select a Category
              </option>
              {categories.map((category) => (
                <option
                  className="text-[#13315c]"
                  value={category.id}
                  key={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <span className="text-xs text-red-500 mt-1">
                {errors.category_id}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 max-w-xs">
            <label className="text-sm font-semibold text-[#155daf]">
              Image
            </label>

            <input
              type="file"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
              }
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#155daf]/10 file:text-[#155daf] hover:file:bg-[#155daf]/20 text-sm text-gray-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[#155daf] font-semibold mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className={`w-full px-4 py-2 border border-[#13315c] focus:ring focus:outline-none transition-all duration-300 focus:ring-[#13315c] rounded-xl ${errors.category_id ? "border-red-500 focus:ring-offset-red-500" : "focus:ring-[#155daf] border-[#155daf]"} `}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-[#155daf] font-semibold mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-[#13315c] focus:ring focus:outline-none transition-all duration-300 focus:ring-[#13315c] rounded-xl ${errors.stock ? "border-red-500 focus:ring-offset-red-500" : "focus:ring-[#155daf] border-[#155daf]"} `}
            />
            {errors.stock && (
              <span className="text-xs text-red-500 mt-1 ">{errors.stock}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#155daf] font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 border border-[#13315c] focus:ring focus:outline-none transition-all duration-300 focus:ring-[#13315c] rounded-xl ${errors.description ? "border-red-500 focus:ring-offset-red-500" : "focus:ring-[#155daf] border-[#155daf]"} `}
            />
            {errors.description && (
              <span className="text-xs mt-1 text-red-500">
                {errors.description}
              </span>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-[#155daf]"
            />
            <label className="text-[#13315C] text-sm font-semibold">
              Active
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#155daf] text-white py-3 rounded-lg hover:bg-[#13315C] disabled:bg-gray-400 font-semibold transition-colors"
            >
              {loading ? "Saving..." : id ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 border-2 border-[#155daf] text-[#155daf] py-2 rounded-lg hover:bg-[#155daf] hover:text-white font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
