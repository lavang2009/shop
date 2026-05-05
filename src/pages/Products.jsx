import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import { useProducts } from "../context/ProductContext";
import { categoryCards } from "../data/siteContent";

const categories = ["Tất cả", "Sữa rửa mặt", ...categoryCards.map((item) => item.title)];

export default function Products() {
  const { products, loading } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const items = products.filter((product) => {
      const matchText =
        !lower ||
        product.name?.toLowerCase().includes(lower) ||
        product.shortDescription?.toLowerCase().includes(lower) ||
        product.description?.toLowerCase().includes(lower);
      const matchCategory = category === "Tất cả" || (product.category || "Sữa rửa mặt") === category;
      return matchText && matchCategory;
    });

    items.sort((a, b) => {
      if (sort === "price-asc") return Number(a.price || 0) - Number(b.price || 0);
      if (sort === "price-desc") return Number(b.price || 0) - Number(a.price || 0);
      return Number(b.createdAt?.seconds || 0) - Number(a.createdAt?.seconds || 0);
    });

    return items;
  }, [products, query, category, sort]);

  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Danh mục"
        title="Sản phẩm"
        subtitle="Tìm nhanh sữa rửa mặt theo nhu cầu, xem giá và mở trang chi tiết từng sản phẩm."
      />

      <div className="glass-card mt-8 rounded-3xl p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <label className="relative block lg:col-span-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-11"
              placeholder="Tìm sản phẩm..."
            />
          </label>

          <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:grid-cols-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              {filtered.length} sản phẩm
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <LoadingScreen label="Đang tải sản phẩm..." />
        ) : filtered.length ? (
          <ProductGrid products={filtered} />
        ) : (
          <EmptyState
            title="Chưa tìm thấy sản phẩm"
            description="Hãy đổi từ khóa hoặc thêm sản phẩm mới trong trang quản trị để làm đầy shop."
            actionLabel="Trang quản trị"
            actionTo="/admin"
          />
        )}
      </div>
    </section>
  );
}
