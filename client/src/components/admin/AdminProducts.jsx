import { useState } from "react";
import { NavLink } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useState(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error(`Failed to delete product`, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    <div className="flex items-center justify-center h-96 ">
      <div className="w-12 h-12 animate-spin border-[#13315c] border-b-2 rounded-full"></div>
    </div>;
  }

  return (
    <>
      <div className="space-y-7">
        <div className="flex items-center justify-between ">
          <h2 className="text-3xl font-bold text-[#13315c]">Products</h2>
          <NavLink
            className="bg-[#155daf] hover:bg-[#13315c] px-4 py-2 transition-all duration-300 rounded-lg text-white"
            to="new/"
            end
          >
            + Add Products
          </NavLink>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 ">
          <input
            type="text"
            placeholder="Search Products"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className="w-full px-4 py-2 border rounded-xl border-[#13315c] focus:outline-none focus:ring focus:ring-[#13315c]"
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#13315c] text-white ">
              <tr>
                <th className="px-6 py-3 font-semibold text-left text-sm">
                  Product Name
                </th>
                <th className="px-6 py-3 font-semibold text-left text-sm">
                  Category
                </th>
                <th className="px-6 py-3 font-semibold text-left text-sm">
                  Price
                </th>
                <th className="px-6 py-3 font-semibold text-left text-sm">
                  Stock
                </th>
                <th className="px-6 py-3 font-semibold text-left text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200 ">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#13315c] ">
                      {product.name}
                    </td>
                    <td className="px-6 py-4  text-gray-600 ">
                      {product.category?.name}
                    </td>
                    <td className="px-6 py-4  font-semibold text-[#155daf]  tracking-wider text-sm">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-xl font-medium text-sm ${product.stock > 0 ? "bg-green-100 text-green-500" : "text-red-500 bg-red-100"}`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="flex py-4 px-6 gap-2">
                        <NavLink
                      to={`/admin/products/${product.id}`}
                      className="text-[#155daf] hover:text-[#13315C] font-semibold bg-sky-200 rounded-md  px-2 py-0.5 "
                    >
                      Edit
                    </NavLink>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 cursor-pointer hover:text-red-600 font-semibold bg-red-200 px-2 py-0.5 rounded-md "
                    >
                      Delete
                    </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-600"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
