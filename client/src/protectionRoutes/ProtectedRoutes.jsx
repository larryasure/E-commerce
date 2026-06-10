import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoutes({ children }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex it">
        
      </div>
    )
  }

  return children;
}
