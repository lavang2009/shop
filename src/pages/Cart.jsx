import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

export default function Cart() {
  const { items, subtotal, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Mua hàng"
        title="Giỏ hàng"
        subtitle="Danh sách sản phẩm bạn đã chọn, có thể thay đổi số lượng trước khi thanh toán."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          {items.length ? (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => addToCart(item, 1)}
                onDecrease={(id) => updateQuantity(id, item.quantity - 1)}
                onRemove={removeFromCart}
              />
            ))
          ) : (
            <EmptyState
              title="Giỏ hàng đang trống"
              description="Bạn có thể quay lại danh sách sản phẩm để thêm món phù hợp cho làn da của mình."
              actionLabel="Xem sản phẩm"
              actionTo="/products"
            />
          )}
        </div>

        <aside className="soft-panel h-fit p-6 md:p-8">
          <p className="section-eyebrow">Tổng kết</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Đơn hàng của bạn</h3>
          <div className="mt-6 space-y-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Tạm tính</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Phí ship</span>
              <span className="font-semibold text-slate-900">Tùy khu vực</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-black text-slate-900">
              <span>Tổng</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <button className="btn-primary w-full" onClick={() => navigate("/checkout")} disabled={!items.length}>
              <ShoppingBag className="h-4 w-4" />
              Đi đến thanh toán
            </button>
            <Link to="/products" className="btn-secondary w-full">
              Tiếp tục mua hàng
            </Link>
            <button className="btn-secondary w-full" onClick={clearCart} disabled={!items.length}>
              Xóa toàn bộ
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
