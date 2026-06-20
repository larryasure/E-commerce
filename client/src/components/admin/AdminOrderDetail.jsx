import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    image: "",
    stock: "",
    category_id: "",
    is_active: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("categories/");
        setCategories(response.data);

        if (id) {
          const productRes = await axiosInstance.get(`products/${id}/`);
          setFormData({
            name: productRes.data.name || "",
            slug: productRes.data.slug || "",
            description: productRes.data.description || "",
            stock: productRes.data.stock || "",
            category_id: productRes.data.category_id || "",
            price: productRes.data.price || "",
            is_active: productRes.data.is_active || "",
            image: productRes.data.image || "",
          });
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
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

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
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
        category: formData.category_id,
        stock: formData.stock,
        image: formData.image,
        is_active: formData.is_active,
      };

      if (id) {
        await axiosInstance.put(`products/${id}/`, data);
        setSuccess("Product Updated successfully!");
      } else {
        await axiosInstance.post("products/", data);
      }
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="items-center flex justify-center h-96">
        <div className="w-12 h-12 rounded-full border-[#13315c] border-b-2 animate-spin">

        </div>
      </div>
    )
  }
  return <div></div>;
}
