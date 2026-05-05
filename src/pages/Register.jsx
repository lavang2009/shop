import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { isStrongPassword, isValidEmail, normalizePhoneNumber } from "../utils/format";

export default function Register() {
  const { registerWithEmail } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!displayName.trim()) return toast.error("Vui lòng nhập tên hiển thị.");
    if (!isValidEmail(email)) return toast.error("Email không hợp lệ.");
    if (!isStrongPassword(password)) return toast.error("Mật khẩu phải có ít nhất 6 ký tự và gồm chữ + số.");
    if (password !== confirmPassword) return toast.error("Mật khẩu nhập lại không khớp.");

    setBusy(true);
    try {
      await registerWithEmail({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        phoneNumber: normalizePhoneNumber(phone),
      });
      toast.success("Đăng ký thành công.");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại.");
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
          <p className="page-subtitle">Nhập tên hiển thị, email hoặc số điện thoại, mật khẩu và xác nhận lại mật khẩu.</p>
        </div>
        <form onSubmit={handleSubmit} className="soft-panel p-8">
          <div className="space-y-5">
            <div>
              <label className="label-text">Tên hiển thị</label>
              <input className="input-field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label-text">Email</label>
                <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="label-text">Số điện thoại (tuỳ chọn)</label>
                <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912345678" />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label-text">Mật khẩu</label>
                <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label className="label-text">Nhập lại mật khẩu</label>
                <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Đang tạo tài khoản..." : "Đăng ký"}</button>
            <p className="text-center text-sm text-slate-500">Đã có tài khoản? <Link to="/login" className="font-semibold text-sky-600">Đăng nhập</Link></p>
          </div>
        </form>
      </div>
    </section>
  );
}
