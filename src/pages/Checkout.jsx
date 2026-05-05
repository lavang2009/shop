import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SectionHeader from "../components/SectionHeader";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

export default function Checkout() {
  const { items, subtotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: "", phone: "", note: "", paymentMethod: "COD", shippingMethod: "Tiêu chuẩn" });
  const [busy, setBusy] = useState(false);

  const total = subtotal + (form.shippingMethod === "Hỏa tốc" ? 30000 : 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const orderId = await placeOrder(form);
      toast.success(`Đặt hàng thành công: ${orderId}`);
      navigate("/orders");
    } catch (error) {
      toast.error(error.message || "Thanh toán thất bại.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Thanh toán"
        title="Đặt hàng"
        subtitle="Điền địa chỉ nhận hàng, phương thức thanh toán và ghi chú nếu cần."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="soft-panel p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label-text">Địa chỉ nhận hàng</label>
              <input className="input-field" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Số nhà, đường, phường, quận..." />
            </div>
            <div>
              <label className="label-text">Số điện thoại</label>
              <input className="input-field" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="0912345678" />
            </div>
            <div>
              <label className="label-text">Thanh toán</label>
              <select className="input-field" value={form.paymentMethod} onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}>
                <option value="COD">COD</option>
                <option value="Bank">Chuyển khoản</option>
              </select>
            </div>
            <div>
              <label className="label-text">Giao hàng</label>
              <select className="input-field" value={form.shippingMethod} onChange={(e) => setForm((prev) => ({ ...prev, shippingMethod: e.target.value }))}>
                <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                <option value="Hỏa tốc">Hỏa tốc (+30.000đ)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label-text">Ghi chú</label>
              <textarea className="input-field min-h-[120px]" value={form.note} onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))} placeholder="Ví dụ: gọi trước khi giao..." />
            </div>
          </div>
          <button className="btn-primary mt-6 w-full" disabled={busy || !items.length}>{busy ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}</button>
        </form>

        <aside className="soft-panel h-fit p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900">Tổng quan đơn</h3>
          <div className="mt-5 space-y-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Sản phẩm</span>
              <span className="font-semibold text-slate-900">{items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Tạm tính</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Phí ship</span>
              <span className="font-semibold text-slate-900">{form.shippingMethod === "Hỏa tốc" ? formatCurrency(30000) : "Miễn phí"}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-black text-slate-900">
              <span>Tổng thanh toán</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
