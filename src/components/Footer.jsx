import { Heart, Mail, PhoneCall, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  ["/products", "Sản phẩm"],
  ["/categories", "Bộ sưu tập"],
  ["/about", "Giới thiệu"],
  ["/faq", "FAQ"],
  ["/policies", "Chính sách"],
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200/70 bg-white">
      <div className="section-shell py-10">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-slate-900">FreshGlow Store</p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Website bán sữa rửa mặt theo phong cách hiện đại, responsive và dễ mở rộng.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Liên kết</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              {footerLinks.map(([to, label]) => (
                <Link key={to} to={to} className="transition hover:text-slate-900">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Hỗ trợ</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><PhoneCall className="h-4 w-4" /> 1900 1234</span>
              <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> support@freshglow.vn</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Việt Nam</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Công nghệ</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              React + Firebase + TailwindCSS, hỗ trợ deploy Vercel và phân quyền seller/admin.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FreshGlow Store.
          </p>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            Làm bằng <Heart className="h-4 w-4 text-rose-500" /> với React + Firebase
          </p>
        </div>
      </div>
    </footer>
  );
}
