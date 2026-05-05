import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen label="Đang kiểm tra phiên đăng nhập..." />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
