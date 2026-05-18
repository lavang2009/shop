import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export default function SectionHero() {
  return (
    <section className="bg-hero-gradient">
      <div className="section-shell py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft">
              <Sparkles className="h-4 w-4 text-sky-500" />
              Chuyên trang sữa rửa mặt
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
              Làm sạch dịu nhẹ,
              <span className="block text-sky-600">chăm da thông minh.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              Mang đến giải pháp chăm sóc da toàn diện với các dòng sản phẩm chính hãng, an toàn và phù hợp với mọi loại da. Khởi đầu chu trình skincare hoàn hảo của bạn ngay hôm nay.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className="btn-primary">
                Xem sản phẩm <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="btn-secondary">
                Tạo tài khoản
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Chính hãng", desc: "Cam kết 100%" },
                { icon: Truck, title: "Giao hàng", desc: "Nhanh chóng toàn quốc" },
                { icon: Sparkles, title: "Đổi trả", desc: "Dễ dàng trong 7 ngày" },
              ].map((item) => (
                <div key={item.title} className="glass-card rounded-3xl p-4">
                  <item.icon className="h-5 w-5 text-sky-600" />
                  <p className="mt-3 font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-sky-100 blur-3xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-4 shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=1200&q=80"
                  alt="Sữa rửa mặt"
                  className="h-72 w-full rounded-[1.5rem] object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="glass-card rounded-[2rem] p-6">
                  <p className="text-sm font-medium text-slate-500">Hiệu quả</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">Sạch sâu</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Lấy đi bụi bẩn, bã nhờn mà không làm khô căng da.
                  </p>
                </div>
                <div className="glass-card rounded-[2rem] p-6">
                  <p className="text-sm font-medium text-slate-500">Thành phần</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">An toàn</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Chiết xuất thiên nhiên, lành tính với cả da nhạy cảm.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
