import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import {X, Menu} from "lucide-react"

export default function AdminCategories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", slug: "", image: null });
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("categories/");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load categories");
    } 
  };

  const handleSubmitCat = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      setError("Fields are required");
      return;
    }
    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("slug", formData.slug);

    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    setLoading(true);
    try {
      if (editingId) {
        await axiosInstance.put(`categories/${editingId}/`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Updated successfully!");

      } else {
        await axiosInstance.post("categories/", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccess("Category saved successfully!");
      }

      setFormData({ name: "", slug: "", image: "" });
      setEditingId(null);
      setSelectedCategory(null);
      setShowFormModal(false);
      await fetchCategories();
      setError("");
    } catch (error) {
      console.log(error.response?.data || error);
      setError(error.response?.data?.detail || "Failed to save categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`categories/${id}/`);
      setCategories(categories.filter((cat) => cat.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const openEditModal = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || null,
    });
    setSelectedCategory(category);
    setEditingId(category.id);
    setShowFormModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 ">
        <div className="w-12 h-12 rounded-full border-b-2 border-[#13315c] animate-spin "></div>
      </div>
    );
  }

  // const filteredCategories = categories.filter((cat) => (
  //   cat.toLowerCase()
  // ))
  

  return (
    <>
      <div className="space-y-6 ">
        <div className="flex items-center justify-between ">
          <h1 className="text-2xl font-bold text-[#13315c]">Categories</h1>

          <button
            className="text-white bg-[#155daf] hover:bg-[#13315c] transition-all duration-300  p-1.5 rounded-lg active:scale-105 cursor-pointer "
            onClick={() => {
              setEditingId(null);
              setSelectedCategory(null);

              setFormData({
                name: "",
                slug: "",
                image: null,
              });

              setShowFormModal(true);
            }}
          >
            Add Category
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm  font-semibold">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm  font-semibold">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-sm  font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#13315c] ">
                      {" "}
                      {category.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#13315c] ">
                      {" "}
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 flex gap-3  ">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-[#155daf] hover:text-[#13315c] font-medium  transition-all duration-200  cursor-pointer "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteModal(category)}
                        className=" text-red-500 font-bold hover:text-red-600 cursor-pointer transition-all duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed bg-black/50 backdrop-blur-sm inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white items-center justify-center p-8 rounded-xl max-w-md w-full ">
            <div className="space-y-3">
              <div className="text-xl font-bold text-[#13315c]">
                {editingId ? "Edit Category" : "Add Category"}
              </div>

              <form className="space-y-6" onSubmit={handleSubmitCat}>
                <div>
                  <label className="text-sm text-[#13315c] font-medium block mb-1 ">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={`w-full border border-[#13315c] py-2 px-4 rounded-xl  focus:ring focus:ring-[#13315c] focus:outline-none transition-all duration-300`}
                  />
                </div>

                <div>
                  <label className="text-sm text-[#13315c] font-medium block mb-1 ">
                    Slug
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full border border-[#13315c] py-2 px-4 rounded-xl  focus:ring focu:ring-[#13315c] focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.files[0],
                      }))
                    }
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#155daf]/10 file:text-[#155daf] hover:file:bg-[#155daf]/20 text-sm text-gray-500 cursor-pointer"
                  />
                </div>

                {error && (
                  <span className="text-xs text-red-500 text-center items-center flex justify-center">
                    {error}
                  </span>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-1.5 bg-[#155daf] hover:bg-[13315c] text-white rounded-md active:scale-105  "
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {
        showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 ">
            <div className="bg-white p-8  rounded-xl shadow max-w-sm w-full flex items-center flex-col gap-2">
              <div onClick={() => setShowDeleteModal(null) } className="w-10 h-10 bg-red-300 rounded-full shadow flex items-center justify-center ">
                <X className="text-red-500 cursor-pointer active:scale-105  "/>
              </div>
              <div className="">
                  <h2 className="text-[#13315c] font-bold text-xl ">Delete Category!</h2>
              </div>

              <div className="mt-2 text-center ">
                <p>Are you sure you want to delete this category?</p>
              </div>
            </div>

            
            <div className="mt-6 ">

            </div>
            

          </div>
        )
}
    </>
  );
}
