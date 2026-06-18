import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminProtectedRoutes({ children }) {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="py-12 min-h-screen items-center justify-center ">
        <div className="w-12 h-12 rounded-full border-b animate-spin border-[#13315c]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login"  replace/>;
  }

  if ( !user?.is_staff) {
    return <Navigate to="/products" replace/>;
  }

  return children;
}
