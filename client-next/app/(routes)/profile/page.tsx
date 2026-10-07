"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { axiosInstance } from "@/lib/api/client";

export default function ProfilePage() {
  const { user, token, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(() => ({
    bio: user?.profile?.bio ?? "",
    address: user?.profile?.address ?? "",
    phone_number: user?.profile?.phone_number ?? "",
    avatar:
      typeof user?.profile?.avatar === "string" ? user.profile.avatar : "",
  }));
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
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
    const newErrors: Record<string, string> = {};
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!validateProfile() || !token) return;

    setLoading(true);
    try {
      await axiosInstance.patch("/me/profile/", {
        bio: profileData.bio,
        address: profileData.address,
        phone_number: profileData.phone_number,
      });
      setSuccess("Profile updated Successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!handleValidatePassword() || !token) return;

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
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to change password!" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-infinity loading-xl"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-12 mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="shadow-2xl rounded-xl bg-white p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row mb-6 gap-6">
            <div className="w-24 h-24 rounded-full bg-[#155daf] text-white flex items-center justify-center text-2xl font-bold">
              {user?.username?.[0].toUpperCase()}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h2 className="text-lg font-semibold text-[#13315c] mb-1 capitalize">
                {user?.username}
              </h2>
              <p className="text-gray-600 mb-2 font-medium text-sm">
                {user?.email}
              </p>
              <p className="text-xs font-semibold text-[#155daf]">
                {user?.profile?.is_verified
                  ? "✓ Verified Account"
                  : "Pending Verification"}
              </p>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => logout()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setErrors({});
                  setSuccess("");
                }}
                className={`flex-1 px-4 py-2 shadow font-semibold text-center duration-300 transition-all text-sm sm:text-base cursor-pointer ${
                  activeTab === "profile"
                    ? "text-[#155daf] border-b-2 border-[#155daf]"
                    : "text-gray-600 hover:text-[#13315c]"
                }`}
              >
                Profile Information
              </button>

              <button
                onClick={() => {
                  setActiveTab("password");
                  setErrors({});
                  setSuccess("");
                }}
                className={`flex-1 px-4 py-2 shadow font-semibold text-center duration-300 transition-all text-sm sm:text-base cursor-pointer ${
                  activeTab === "password"
                    ? "text-[#155daf] border-b-2 border-[#155daf]"
                    : "text-gray-600 hover:text-[#13315c]"
                }`}
              >
                Change Password
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {success && (
                <p className="mb-6 p-4 bg-green-50 text-green-600 hover:text-green-700 border-green-100 rounded-lg text-sm">
                  ✓ {success}
                </p>
              )}

              {errors.submit && (
                <p className="mb-6 p-4 bg-red-50 text-red-600 hover:text-red-700 border-red-200 rounded-lg text-sm">
                  ✗ {errors.submit}
                </p>
              )}

              {activeTab === "profile" && (
                <form className="space-y-5" onSubmit={handleUpdateProfile}>
                  <div>
                    <label className="block text-[#155daf] font-semibold mb-2 text-sm">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-[#155daf] rounded-xl focus:outline-none focus:ring focus:ring-[#13315c] transition-all duration-300 text-sm"
                      rows={3}
                      placeholder="Tell us about yourself!"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-5">
                    <div className="flex-1 flex flex-col">
                      <label className="block text-[#155daf] font-semibold mb-2 text-sm">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={profileData.phone_number}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-xl border-2 focus:outline-none focus:ring focus:ring-[#13315c] transition-all duration-300 ${
                          errors.phone_number
                            ? "text-red-600 focus:ring-red-500 border-red-500"
                            : "border-[#155daf] focus:ring-[#13315c]"
                        }`}
                      />
                      {errors.phone_number && (
                        <span className="text-xs mt-1 text-red-500">
                          {errors.phone_number}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <label className="text-sm block text-[#155daf] font-semibold mb-2">
                        Address
                      </label>

                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className={`px-4 py-2 rounded-xl border-2 focus:outline-none focus:ring focus:ring-[#13315c] transition-all duration-300 ${
                          errors.address
                            ? "text-red-500 focus:ring-red-500 border-red-500"
                            : "border-[#155daf] focus:ring-[#13315c]"
                        }`}
                      />
                      {errors.address && (
                        <span className="text-xs mt-1 text-red-600">
                          {errors.address}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#155daf] text-white py-3 mt-3 rounded-lg hover:bg-[#13315C] disabled:bg-gray-400 font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              )}

              {activeTab === "password" && (
                <form
                  onSubmit={handleChangePassword}
                  className="space-y-5 max-w-md"
                >
                  <div>
                    <label className="block text-sm text-[#155daf] font-semibold mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 rounded-xl focus:outline-none focus:ring focus:ring-[#155daf] transition-all duration-300 text-sm border-2 ${
                        errors.oldPassword
                          ? "text-red-600 focus:ring-red-500 border-red-500"
                          : "border-[#155daf] focus:ring-[#13315c]"
                      }`}
                    />
                    {errors.oldPassword && (
                      <span className="text-xs mt-1 text-red-500">
                        {errors.oldPassword}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#155daf]">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full border-2 py-2 px-4 rounded-xl focus:outline-none focus:ring focus:ring-[#155daf] text-sm transition-all duration-300 ${
                        errors.newPassword
                          ? "text-red-600 focus:ring-red-500 border-red-500"
                          : "border-[#155daf] focus:ring-[#13315c]"
                      }`}
                    />
                    {errors.newPassword && (
                      <span className="text-xs mt-1 text-red-500">
                        {errors.newPassword}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#155daf]">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full border-2 py-2 px-4 rounded-xl focus:outline-none focus:ring focus:ring-[#155daf] text-sm transition-all duration-300 ${
                        errors.confirmPassword
                          ? "text-red-600 focus:ring-red-500 border-red-500"
                          : "border-[#155daf] focus:ring-[#13315c]"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <span className="text-xs mt-1 text-red-500">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#155daf] text-white py-3 mt-3 rounded-lg hover:bg-[#13315C] disabled:bg-gray-400 font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {loading ? "Updating..." : "Change Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
