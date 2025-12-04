import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking auth (optional)
  if (loading) return <div>Loading...</div>;

  // If not logged in
  if (!user) {
    toast.error("You must be logged in to access this page");
    return <Navigate to="/login" replace />;
  }

  return children;
}
