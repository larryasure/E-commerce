import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
// 1. Import your auth hook or context here (e.g., import { useAuth } from "../../context/AuthContext")

export default function AdminUsers() {
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const currentUser = { id: 99, is_staff: true };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("users/");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to Load Users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.username?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      return name.includes(search) || email.includes(search);
    });
  }, [users,  searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`users/${id}/`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete error", error);
    }
  };

  const toggleStaff = async (user) => {
    try {
      const updatedStatus = !user.is_staff;
      await axiosInstance.patch(`users/${user.id}/`, {
        is_staff: updatedStatus,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_staff: updatedStatus } : u,
        ),
      );
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#13315c] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[#13315c]">Users</h2>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm max-w-xs w-full focus:outline-none focus:border-[#155daf]"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#155daf] text-white">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 capitalize font-medium text-gray-800">
                      {user.username}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.is_staff
                              ? "bg-[#13315c]/10 text-[#13315c]"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.is_staff ? "Admin" : "Customer"}
                        </span>
                        <button
                          onClick={() => toggleStaff(user)}
                          className="text-[#155daf] hover:text-[#13315c] text-xs font-medium hover:underline"
                        >
                          {user.is_staff ? "Remove Admin" : "Make Admin"}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {currentUser?.is_staff ? (
                        <button
                          onClick={() => setUserToDelete(user.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition-all"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-gray-300 cursor-not-allowed text-sm font-medium select-none">
                          Delete
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {userToDelete !== null && (
        <div className="fixed bg-black/50 backdrop-blur-sm flex items-center justify-center inset-0 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm transition-colors"
                onClick={() => {
                  handleDelete(userToDelete);
                  setUserToDelete(null);
                }}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
