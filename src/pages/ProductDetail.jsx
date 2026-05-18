import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, ShoppingBag, Package } from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import ProductGrid from "../components/ProductGrid";
import ReviewSection from "../components/ReviewSection"; // 🔥 Import Component Mới
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

export default function ProductDetail() {
  const { id } = useParams();
  const { getProductById, getRelatedProducts } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const result = await getProductById(id);
      if (mounted) {
        setProduct(result);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, getProductById]);

  if (loading) return <LoadingScreen label="Đang tải chi tiết sản phẩm..." />;
  if (!product) {
    return (
      <div className="section-shell py-16">
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm có thể đã bị xóa hoặc liên kết không còn hợp lệ."
          actionLabel="Quay về danh sách"
          actionTo="/products"
        />
      </div>
    );
  }

  const related = getRelatedProducts(product.id, 4);
  const inStock = product.stock > 0;

  return (
    <section className="section-shell py-12 pb-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {product.category || "Sữa rửa mặt"}
          </div>
          <h1 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl lg:text-5xl lg:leading-tight">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(product.price)}</p>
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              <Package className="h-4 w-4" />
              {inStock ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">{product.shortDescription || product.description}</p>

          <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-900">Mô tả chi tiết</p>
            <p className="mt-3 text-sm leading-8 text-slate-600 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button 
              className="btn-primary" 
              onClick={() => addToCart(product)}
              disabled={!inStock}
            >
              <ShoppingBag className="h-4 w-4" />
              {inStock ? "Thêm vào giỏ" : "Hết hàng"}
            </button>
            <Link to="/cart" className="btn-secondary">
              Đi tới giỏ hàng
            </Link>
          </div>
        </div>
      </div>

      {/* 🔥 COMPONENT REVIEW */}
      <ReviewSection productId={product.id} />

      <div className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Sản phẩm liên quan</p>
            <h2 className="page-title mt-2">Gợi ý thêm</h2>
          </div>
          <Link to="/products" className="btn-secondary">Xem thêm</Link>
        </div>
        <div className="mt-8">
          {related.length ? <ProductGrid products={related} /> : <EmptyState title="Chưa có dữ liệu liên quan" description="Khi có thêm sản phẩm cùng loại, hệ thống sẽ gợi ý ở đây." />}
        </div>
      </div>
    </section>
  );
}
