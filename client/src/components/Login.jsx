import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: "",
        };
      }

      return prev;
    });
  };

  const handleValidForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        setSuccess("Login successful, Please wait...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        console.log("Login failed");

        if (result.error) {
          console.log("Server error:", result.error);

          if (result.error.detail) {
            console.log("Setting submit error");
            setErrors({ submit: "Invalid credentials, Try Again!" });
          } else if (result.error.non_field_errors) {
            console.log("Setting submit error");
            setErrors({ submit: "Invalid credentials, Try Again!" });
          }
        } else {
          console.log("No error object");
          setErrors({ submit: "Login Failed, Try again later" });
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
      <div className="flex items-center justify-center my-20 sm:my-24 px-4 ">
        <div className=" max-w-sm w-full shadow-xl rounded-lg bg-white p-8">
          <h2 className="text-3xl font-bold text-[#13315C] text-center">
            PrimePack
          </h2>
          <p className="text-lg mt-2 text-[#13315C] text-center">
            Login to your account
          </p>

          <div className="mt-6">
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}

            {success && (
              <div className="mb-3  text-center">
                <p className="text-xs text-green-600">{success}</p>
              </div>
            )}

            {errors.submit && (
              <div className="mb-3   text-center  rounded-md  ">
                <p className="text-xs text-red-600 ">{errors.submit}</p>
              </div>
            )}
          </div>

          <form className="mt-7 space-y-7" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-[#155daf] ">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your Username"
                className={`w-full rounded-lg border border-[#0b52b5] px-4 py-2  focus:outline-0 focus:ring-1 focus:ring-[#0b52b5] placeholder:text-sm transition-all duration-300 ${errors.username ? "border-red-400" : "border-[#0b52b5]"}`}
              />
              {errors.username && (
                <span className="text-xs text-red-500">{errors.username}</span>
              )}
            </div>

            <div>
              <label className="block mb-2 text-[#155daf] text-sm font-bold">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                className={`w-full px-4 py-2 rounded-lg border border-[#0b52b5] focus:outline-0 focus:ring-1 focus:ring-[#0b52b5] placeholder:text-sm transition-all duration-300 ${errors.password ? "border-red-400" : "border-[#0b52b5]"}`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition duration-200 active:scale-110"
            >
              {loading ? "Logging in ..." : "Log in "}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
