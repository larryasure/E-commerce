import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    bio: "",
    address: "",
    phone_number: "",
    avatar: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?.profile) {
      setProfileData({
        avatar: user.profile.avatar,
        bio: user.profile.bio,
        address: user.profile.address,
        phone_number: user.profile.phone_number,
      });
      if (user.profile.avatar && !avatarPreview) {
        setAvatarPreview(user.profile.avatar);
      }
    }
  }, [user, avatarPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfileData((prev) => ({ ...prev, avatar: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profileData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required!";
    }

    if (!profileData.address.trim()) {
      newErrors.address = "Address is required!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidatePassword = () => {
    const newErrors = {};
    if (!passwordData.oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required!";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New Password is required!";
    }

    if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "New Password must be at least 8 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validateProfile()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("bio", profileData.bio);
      formData.append("address", profileData.address);
      formData.append("phone_number", profileData.phone_number);

      if (profileData.avatar instanceof File) {
        formData.append("avatar", profileData.avatar);
      }

      const response = await axiosInstance.patch("/me/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.avatar) {
        setAvatarPreview(response.data.avatar);
      }

      setSuccess("Profile updated Successfully!");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.detail || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!handleValidatePassword()) return;

    setLoading(true);

    try {
      await axiosInstance.post("/change-password/", {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(error);
      setSuccess({
        submit: error.response?.data.detail || "Failed to change password!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="shadow-2xl rounded-xl  bg-white p-6 sm:p-8 mb-8 ">
            <div className="flex flex-col sm:flex-row mb-6 gap-6">
              <div className="relative group ">
                <img
                  src={
                    avatarPreview ||
                    `https://ui-avatars.com/api/?name=${user?.username}&background=ccccee&color=ffffff`
                  }
                  alt={user?.username}
                  className="  w-24 h-24 rounded-full object-cover border-2  border-blue-200 shadow-md"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user?.username}&background=cccccc&color=ffffff`;
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute  inset-0 rounded-full bg-black/40 opacity-20 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                >
                  <svg
                    className="w-full h-full  text-white"
                    fill="currentColor"
                    viewBox="-10 0 38 5"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                  </svg>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="text-center sm:text-left flex-1 ">
                <h2 className="text-lg font-semibold text-[#13315c] mb-1 capitalize">
                  {user?.username}
                </h2>
                <p className="text-gray-600 mb-2 font-medium text-sm ">
                  {user?.email}
                </p>
                <p className="text-xs font-semibold text-[#155daf]">
                  {user?.profile?.is_verified
                    ? "✓ Verified Account"
                    : "Pending Verification"}
                </p>
              </div>
              <div className="flex items-center ">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 text-sm">
                  Logout
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl  overflow-hidden ">
              <div className="flex border-b border-gray-200 ">
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setErrors({});
                    setSuccess("");
                  }}
                  className={`flex-1 px-4 py-2 shadow font-semibold text-center duration-300 transition-all text-sm sm:text-base cursor-pointer ${activeTab === "profile" ? "text-[#155daf] border-b-2 border-[#155daf]" : "text-gray-600 hover:text-[#13315c]  "}`}
                >
                  Profile Information
                </button>

                <button
                  onClick={() => {
                    setActiveTab("password");
                    setErrors({});
                    setSuccess("");
                  }}
                  className={`flex-1 px-4 py-2 shadow font-semibold text-center duration-300 transition-all text-sm sm:text-base cursor-pointer ${activeTab === "password" ? "text-[#155daf] border-b-2 border-[#155daf]" : "text-gray-600 hover:text-[#13315c]  "}`}
                >
                  Change Password
                </button>
              </div>

              <div className="p-6 sm:p-8 ">
                {success && (
                  <p className="mb-6 p-4 bg-green-50 text-green-600 hover:text-green-700 border-green-100 rounded-lg text-sm ">
                    {" "}
                    ✓ {success}
                  </p>
                )}

                {errors.submit && (
                  <p className="mb-6 p-4 bg-red-50 text-red-600 hover:text-red-700 border-red-200 rounded-lg text-sm ">
                    {" "}
                    ✗ {errors.submit}
                  </p>
                )}

                {activeTab === "profile" && (
                  <form className="space-y-5" onSubmit={handleUpdateProfile}>
                    <div>
                      <label className="block text-[#155daf] font-semibold mb-2 text-sm ">Bio</label>
                      <textarea name="bio" value={profileData.bio} onChange={handleChange} className="w-full px-4 py-2 border-2 border-[#155daf] rounded-xl focus:outline-none focus:ring focus:ring-[#13315c] transition-all duration-300 text-sm" rows={3} placeholder="Tell us about yourself!" />
                      

                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
