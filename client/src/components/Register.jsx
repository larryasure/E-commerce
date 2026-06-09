import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: ""}))
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSuccess(
          "Registration successful! Check your email to verify your account.",
        );
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        if (result.error) {
          if (result.error.username) {
            setErrors((prev) => ({
              ...prev,
              username: result.error.username[0],
            }));
          }

          if (result.error.email) {
            setErrors((prev) => ({ ...prev, email: result.error.email[0] }));
          }

          if (result.error.password) {
            setErrors((prev) => ({
              ...prev,
              password: result.error.password[0],
            }));
          }
        }
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occured", error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-10  flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-[#13315C]  text-center mb-2 ">
            PrimePack
          </h1>

          <p className=" text-lg text-[#13315c] text-center ">
            Create Your account{" "}
          </p>

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
                className={`w-full px-4 py-2 rounded-lg border border-[rgb(21,93,175)] focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${errors.username ? "border-red-500" : "border-[rgb(21,93,175)]"}`}
              />
              {errors.username && (
                <span className="text-xs text-red-500 ">{errors.username}</span>
              )}
            </div>

            <div>
              <label className="font-bold text-sm mb-1 block text-[#155daf] ">
                Email
              </label>
              <input
                type="text"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                className={` w-full px-4 py-2 rounded-lg border border-[rgb(21,93,175)] focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${errors.email ? "border-red-400" : "border-[rgb(21,93,175)]"} `}
              />
              {errors.email && (
                <span className="text-xs text-red-500 ">{errors.email}</span>
              )}
            </div>

            <div>
              <label className="block text-[#155daf] text-sm mb-1  font-bold">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                className={` w-full px-4 py-2 border border-[rgb(21,93,175)] rounded-lg focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${errors.password ? "border-red-400 " : "border-[rgb(21,93,175)]  "} `}
              />
              {errors.password && (
                <span className="text-xs text-red-500 ">{errors.password}</span>
              )}
            </div>

            <div>
              <label className="block text-[#155daf] text-sm mb-1  font-bold">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                name="confirmPassword"
                placeholder="Confirm your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={` w-full px-4 py-2 border border-[rgb(21,93,175)] rounded-lg focus:outline-0 focus:ring-1 focus:ring-[#155daf] placeholder:text-sm transition-all duration-300 ${errors.password ? "border-red-400 " : "border-[rgb(21,93,175)]  "} `}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-500 ">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

                   {success && (
          <div className="mb-6 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-500 text-sm">{errors.submit}</p>
          </div>
        )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition duration-200 active:scale-110"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm">
              Already have an Account?
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                { " "}Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
