import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D11] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00D8F6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Pass the attempted path so LoginPage can redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
