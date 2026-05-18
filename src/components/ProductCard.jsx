import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function ProductCard({ product }) {
  // Làm tròn số sao để hiển thị (VD: 4.5 -> 5, 4.2 -> 4)
  const displayRating = Math.round(product.rating || 0);

  return (
    <motion.article
      className="group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-1"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
            {product.category || "Sữa rửa mặt"}
          </div>
          {/* Hiển thị tag Hết hàng nếu kho = 0 */}
          {(product.stock === 0) && (
             <div className="absolute right-4 top-4 rounded-full bg-rose-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
               Hết hàng
             </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                {product.shortDescription || product.description}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                Giá
              </p>
              <p className="text-base font-bold text-emerald-700">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-500">
              {/* Hiển thị sao thật dựa trên đánh giá */}
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < displayRating ? "fill-current" : "text-slate-200"}`} />
              ))}
              <span className="text-xs text-slate-500 ml-1">({product.reviewCount || 0})</span>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              Chi tiết <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
