"use client";
import { useAuthStore } from "@/lib/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleValidate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setSuccess("");
    setErrors({});

    if (!handleValidate) return;

    try {
      await login(formData);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (error: any) {
      
      const serverMessage =
        error.response?.data?.error || error.response?.data?.message;

      let userFriendlyMessage = "Failed to login. Please try again later.";

      if (serverMessage) {
        userFriendlyMessage = serverMessage;
      } else if (error.response?.status === 401) {
        userFriendlyMessage = "Incorrect email or password. Please try again.";
      } else if (error.response?.status === 404) {
        userFriendlyMessage =
          "Account not found. Please check your email or register.";
      } else if (error.message === "Network Error") {
        userFriendlyMessage =
          "Network error. Please check your internet connection.";
      }

      setErrors({ submit: userFriendlyMessage });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center  min-h-screen">
        <div className="max-w-sm w-full shadow-xl rounded-xl bg-white p-8 ">
          <h2 className="text-2xl font-bold text-[#13315C] text-center">
            PrimePack
          </h2>
          <p className=" mt-1 text-[#13315C] text-center">
            Login to your account
          </p>

          {success && (
            <div className="my-2 p-1 bg-green-50 text-green-600 rounded-lg text-xs">
              {success}
            </div>
          )}

          {errors.submit && (
            <div className="my-2 p-1.5 bg-red-50 text-red-600 rounded-lg text-xs">
              {errors.submit}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-[#155daf] text-sm font-semibold">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your Username"
                className={`w-full rounded-lg border px-4 py-2 focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${
                  errors.username ? "border-red-400" : "border-[#0b52b5]"
                }`}
              />
              {errors.username && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.username}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-[#155daf] text-sm font-bold">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${
                  errors.password ? "border-red-400" : "border-[#0b52b5]"
                }`}
              />
              {errors.password && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition duration-200 active:scale-110"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-center mt-2 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
