import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, UserCircle2, Mail, PhoneCall, BadgeCheck } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

export default function Profile() {
  const { user, profile, saveProfile, logout } = useAuth();
  const { itemCount } = useCart();
  const { products } = useProducts();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.displayName || user?.displayName || "");
    setPhoneNumber(profile?.phoneNumber || user?.phoneNumber || "");
  }, [profile, user]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveProfile({ displayName: displayName.trim(), phoneNumber: phoneNumber.trim() });
      toast.success("Đã cập nhật hồ sơ.");
    } catch (error) {
      toast.error(error.message || "Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const role = profile?.role || "customer";

  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Tài khoản"
        title="Trang cá nhân"
        subtitle="Nơi hiển thị hồ sơ người dùng, vai trò tài khoản và vài số liệu nhanh của shop."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="soft-panel p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white">
              <UserCircle2 className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hồ sơ hiện tại</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{profile?.displayName || user?.displayName || "Người dùng"}</h2>
              <p className="mt-1 text-sm text-slate-500">{profile?.email || user?.email || "Chưa có email"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Vai trò</p>
              <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {role.toUpperCase()}
              </p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Giỏ hàng</p>
              <p className="mt-2 font-semibold text-slate-900">{itemCount} sản phẩm</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Sản phẩm hiện có</p>
              <p className="mt-2 font-semibold text-slate-900">{products.length} mục</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Trạng thái</p>
              <p className="mt-2 font-semibold text-emerald-600">Đang hoạt động</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-600">
            <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {profile?.email || user?.email || "Chưa có email"}</p>
            <p className="inline-flex items-center gap-2"><PhoneCall className="h-4 w-4" /> {profile?.phoneNumber || "Chưa cập nhật số điện thoại"}</p>
            <p className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> Quyền được kiểm soát bởi Firestore Rules</p>
          </div>
        </div>

        <form className="soft-panel p-8" onSubmit={handleSave}>
          <p className="section-eyebrow">Cập nhật hồ sơ</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Chỉnh sửa thông tin</h3>
          <div className="mt-6 space-y-5">
            <div>
              <label className="label-text">Tên hiển thị</label>
              <input className="input-field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div>
              <label className="label-text">Số điện thoại</label>
              <input className="input-field" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <button className="btn-primary w-full" disabled={saving}>{saving ? "Đang lưu..." : "Lưu hồ sơ"}</button>
            <button type="button" className="btn-secondary w-full" onClick={logout}>Đăng xuất</button>
          </div>
        </form>
      </div>
    </section>
  );
}
