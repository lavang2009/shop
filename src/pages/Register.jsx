import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  isStrongPassword,
  isValidEmail,
  normalizePhoneNumber,
} from "../utils/format";

export default function Register() {
  const { registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = displayName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = normalizePhoneNumber(phone);

    if (!name) {
      toast.error("Vui lòng nhập tên hiển thị.");
      return;
    }

    if (!cleanEmail) {
      toast.error("Vui lòng nhập email.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    if (!isStrongPassword(password)) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự và gồm chữ + số.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      setBusy(true);

      await registerWithEmail({
        displayName: name,
        email: cleanEmail,
        password,
        phoneNumber: cleanPhone,
      });

      toast.success("Đăng ký thành công.");
      navigate("/profile", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Đăng ký thất bại.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section-shell py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="soft-panel p-8">
          <p className="section-eyebrow">Tạo tài khoản</p>
          <h1 className="page-title mt-2">Đăng ký</h1>
          <p className="page-subtitle mt-3">
            Tạo tài khoản để mua hàng, theo dõi đơn và quản lý hồ sơ cá nhân.
          </p>

          <div className="mt-8 rounded-3xl bg-gradient-to-br from-sky-500/10 to-fuchsia-500/10 p-6 ring-1 ring-white/10">
            <p className="text-sm leading-6 text-slate-600">
              Sau khi đăng ký, hệ thống sẽ tự tạo hồ sơ trong Firestore với role
              mặc định là <span className="font-semibold">customer</span>.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="soft-panel p-8">
          <div className="space-y-5">
            <div>
              <label className="label-text" htmlFor="displayName">
                Tên hiển thị
              </label>
              <input
                id="displayName"
                className="input-field"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
                <label className="label-text" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
                    autoComplete="new-password"
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

              <div>
                <label className="label-text" htmlFor="confirmPassword">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    className="input-field pr-20"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    {showConfirm ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-semibold text-sky-600">
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
