import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/format";

export default function Login() {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidEmail(email)) return toast.error("Email không hợp lệ.");
    if (!password) return toast.error("Vui lòng nhập mật khẩu.");

    setBusy(true);
    try {
      await loginWithEmail({ email: email.trim(), password });
      toast.success("Đăng nhập thành công.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section-shell py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="soft-panel p-8">
          <p className="section-eyebrow">Chào mừng trở lại</p>
          <h1 className="page-title mt-2">Đăng nhập</h1>
          <p className="page-subtitle">Truy cập hồ sơ, giỏ hàng, đơn hàng và trang quản trị nếu bạn có quyền.</p>
        </div>
        <form onSubmit={handleSubmit} className="soft-panel p-8">
          <div className="space-y-5">
            <div>
              <label className="label-text">Email</label>
              <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label-text">Mật khẩu</label>
              <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Đang đăng nhập..." : "Đăng nhập"}</button>
            <p className="text-center text-sm text-slate-500">Chưa có tài khoản? <Link to="/register" className="font-semibold text-sky-600">Đăng ký</Link></p>
          </div>
        </form>
      </div>
    </section>
  );
}
