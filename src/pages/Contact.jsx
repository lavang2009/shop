import { useState } from "react";
import toast from "react-hot-toast";
import SectionHeader from "../components/SectionHeader";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (event) => {
    event.preventDefault();
    toast.success("Đã ghi nhận phản hồi. Đây là demo form liên hệ.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Hỗ trợ"
        title="Liên hệ"
        subtitle="Trang liên hệ đẹp, gọn và có form phản hồi để website trông hoàn chỉnh hơn."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="soft-panel p-8">
          <h3 className="text-2xl font-bold text-slate-900">Thông tin hỗ trợ</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <p>Hotline: 1900 1234</p>
            <p>Email: support@freshglow.vn</p>
            <p>Giờ làm việc: 8:00 - 21:00 mỗi ngày</p>
          </div>
          <div className="mt-8 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-900">Gợi ý</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Bạn có thể nối form này với email service hoặc Firebase Functions sau này.
            </p>
          </div>
        </div>
        <form className="soft-panel p-8" onSubmit={submit}>
          <div className="space-y-5">
            <div>
              <label className="label-text">Họ và tên</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <label className="label-text">Email</label>
              <input className="input-field" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <label className="label-text">Nội dung</label>
              <textarea className="input-field min-h-[150px]" value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} />
            </div>
            <button className="btn-primary w-full">Gửi phản hồi</button>
          </div>
        </form>
      </div>
    </section>
  );
}
