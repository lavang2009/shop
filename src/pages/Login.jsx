import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/format";

export default function Login() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/profile";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.error("Vui lòng nhập email.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    if (!password) {
      toast.error("Vui lòng nhập mật khẩu.");
      return;
    }

    try {
      setBusy(true);
      await loginWithEmail({
        email: cleanEmail,
        password,
      });

      toast.success("Đăng nhập thành công.");
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section-shell py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="soft-panel p-8">
          <p className="section-eyebrow">Chào mừng trở lại</p>
          <h1 className="page-title mt-2">Đăng nhập</h1>
          <p className="page-subtitle mt-3">
            Truy cập hồ sơ cá nhân, giỏ hàng, đơn hàng và trang quản trị nếu
            tài khoản của bạn có quyền.
          </p>

          <div className="mt-8 rounded-3xl bg-gradient-to-br from-sky-500/10 to-fuchsia-500/10 p-6 ring-1 ring-white/10">
            <p className="text-sm leading-6 text-slate-600">
              Gợi ý: tài khoản seller/admin sẽ thấy thêm mục quản trị sau khi
              đăng nhập.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="soft-panel p-8">
          <div className="space-y-5">
            <div>
              <label className="label-text" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label-text" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={busy}
            >
              {busy ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="font-semibold text-sky-600">
                Đăng ký
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
