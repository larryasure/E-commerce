import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fecthCategories = async () => {
      try {
        const response = await axiosInstance.get("categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fecthCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      setError("Field is required");
    }

    try {
      if (editingId) {
        await axiosInstance.put(`categories/${editingId}/`);
        setSuccess("Category Updated");
      } else {
        await axiosInstance.post("categories/");
        setSuccess("Category created");
      }
      setFormData({ name: "", slug: "", image: "" });
      setEditingId(null);
      setShowForm(false);
      fecthCategories();
    } catch (error) {
      setError("Failed to save categories");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      slug: category.name,
      image: category.image,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`categories/${id}`);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()),
  );
  if (loading) {
    <div className="flex items-center justify-center h-96 ">
      <div className="h-12 w-12 rounded-full border-b-2 animate-spin border-[#13315c] "></div>
    </div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[#13315c] font-bold mb-8  ">Category</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setShowForm({ name: "", slug: "", Image: "" });
            }}
            className="bg-[#155daf] text-white px-4 active:scale-105 transition-all duration-300 py-1.5 rounded-lg hover:bg-[#13315C] cursor-pointer font-semibold"
          >
            {showForm ? "Cancel" : "+ Add Category"}
          </button>
     

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#13315C] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Slug</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#13315C]">{category.name}</td>
                  <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-[#155daf] hover:text-[#13315C] font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      </div>

          {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-[#13315C] mb-6">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#155daf] font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#155daf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155daf]"
              />
            </div>
            <div>
              <label className="block text-[#155daf] font-semibold mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#155daf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155daf]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#155daf] text-white py-3 rounded-lg hover:bg-[#13315C] font-semibold transition-colors"
            >
              {editingId ? "Update" : "Create"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
