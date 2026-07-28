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
        phone_number: user.profile.address,
      });
      if (user.profile.avatar) {
        setAvatarPreview(`http://127.0.0.1:8000${user.profile.avatar}`);
      }
    }
  }, [user]);

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
      newErrors.phone_number = "Address is required!";
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

    if (!validateProfile) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("bio", profileData.bio);
      formData.append("address", profileData.address);
      formData.append("phone_number", profileData.phone_number);

      if (profileData.avatar instanceof File) {
        formData.append("avatar", profileData.avatar);
      }

      await axiosInstance.patch("/me/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
        submit: error.response?.data.detail || "Failed to chnage password!",
      });
    } finally {
      setLoading(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="shadow-2xl rounded-xl  bg-white p-6 sm:p-8 mb-8 ">
            <div className="flex flex-col sm:flex-row mb-6 gap-6">
              <div className="relative group ">
                <img
                  src={
                    avatarPreview ||
                    `https://via.placeholder.com/120x120?text=${user?.username}`
                  }
                  alt={user?.username}
                  className="w-24 h-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
