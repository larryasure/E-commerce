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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleValidForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidForm) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);

      if (success) {
        navigate("/dashboard");
      } else {
        if (result.error) {
          if (result.error.non_fileds_errors) {
            setErrors({ submit: result.error.non_fileds_errors[0] });
          }
        } else if (result.error.username) {
          setErrors((prev) => ({
            ...prev,
            username: result.error.username[0],
          }));
        } else if (result.error.password) {
          setErrors((prev) => ({
            ...prev,
            password: result.error.password[0],
          }));
        } else {
          setErrors({ submit: "Login Failed, Try again later " });
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
      <div className="flex items-center justify-center  my-10 px-4 ">
        <div className=" max-w-md w-full shadow-xl rounded-lg bg-white p-8">
          <h2 className="text-3xl font-bold text-[#13315C] text-center">
            PrimePack
          </h2>
          <p className="text-lg mt-2 text-[#13315C] text-center">
            Login to your account
          </p>

          <form className="mt-7 space-x-4">
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
