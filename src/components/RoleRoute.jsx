import { Navigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ children, allowedRoles = ["admin", "seller"] }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen label="Đang kiểm tra quyền truy cập..." />;
  if (!user) return <Navigate to="/login" replace />;

  const role = profile?.role || "customer";
  if (!allowedRoles.includes(role)) {
    return (
      <div className="section-shell py-16">
        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-slate-900">Không đủ quyền truy cập</h2>
          <p className="mt-3 text-sm text-slate-600">
            Tài khoản hiện tại chưa có vai trò seller hoặc admin.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
