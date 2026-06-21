import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
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
        await axiosInstance.put(`/products/${id}/`, data);
        alert("Product updated successfully");
      } else {
        await axiosInstance.post("/products/", data);
        alert("Product created successfully");
      }

      navigate("/admin/products");
    } catch (error) {
      alert("Failed to save product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
  
  );
}