import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import ProductGrid from "../components/ProductGrid";
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

  const related = getRelatedProducts(product.id, 3);

  return (
    <section className="section-shell py-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" />
        Quay lại sản phẩm
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="soft-panel overflow-hidden">
          <div className="aspect-[4/3] bg-slate-100">
            <img
              src={product.imageUrl || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1400&q=80"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="soft-panel p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            <ShieldCheck className="h-4 w-4" />
            Sản phẩm chính hãng / quản lý bởi seller
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-black text-emerald-600">{formatCurrency(product.price)}</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">{product.shortDescription || product.description}</p>

          <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-900">Mô tả chi tiết</p>
            <p className="mt-3 text-sm leading-8 text-slate-600 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary" onClick={() => addToCart(product)}>
              <ShoppingBag className="h-4 w-4" />
              Thêm vào giỏ
            </button>
            <Link to="/cart" className="btn-secondary">
              Đi tới giỏ hàng
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Sản phẩm liên quan</p>
            <h2 className="page-title mt-2">Gợi ý thêm</h2>
          </div>
          <Link to="/products" className="btn-secondary">Xem thêm</Link>
        </div>
        <div className="mt-8">
          {related.length ? <ProductGrid products={related} /> : <EmptyState title="Chưa có dữ liệu liên quan" description="Khi shop có thêm nhiều sản phẩm, mục này sẽ tự đầy hơn." actionLabel="Về trang sản phẩm" actionTo="/products" />}
        </div>
      </div>
    </section>
  );
}
