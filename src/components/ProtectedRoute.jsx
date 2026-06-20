import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { currentUser, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && profile?.role !== role) {
    const fallback = profile?.role === "provider" ? "/dashboard/provider" : "/dashboard/patient";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
