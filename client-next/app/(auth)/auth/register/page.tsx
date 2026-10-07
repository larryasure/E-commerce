"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password cannot be less than 8 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Registration successful Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || "Registration failed" });
    }
  };

  return (
    <>
      <div className="my-10 flex items-center justify-center px-4 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 mt-20">
          <h1 className="text-2xl font-bold text-[#13315C] text-center mb-2">
            PrimePack
          </h1>
          <p className="text-lg text-[#13315c] text-center">
            Create Your account
          </p>

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
              {success}
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div>
              <label className="block text-sm font-bold text-[#155daf] mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${
                  errors.username ? "border-red-500" : "border-[rgb(21,93,175)]"
                }`}
              />
              {errors.username && (
                <span className="text-xs text-red-500">{errors.username}</span>
              )}
            </div>

            <div>
              <label className="font-bold text-sm mb-1 block text-[#155daf]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${
                  errors.email ? "border-red-400" : "border-[rgb(21,93,175)]"
                }`}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>

            <div>
              <label className="block text-[#155daf] text-sm mb-1 font-bold">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${
                  errors.password ? "border-red-400" : "border-[rgb(21,93,175)]"
                }`}
              />
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
            </div>

            <div>
              <label className="block text-[#155daf] text-sm mb-1 font-bold">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your Password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${
                  errors.confirmPassword
                    ? "border-red-400"
                    : "border-[rgb(21,93,175)]"
                }`}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-500">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition duration-200 active:scale-110"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm">
              Already have an Account?
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
