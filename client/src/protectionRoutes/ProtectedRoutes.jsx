import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoutes({ children }) {
  const { loading, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  if (loading) {
    return (
           <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium animate-pulse text-sm">
          Loading your session please wait...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return navigate("/");
  }

  return children;
}
