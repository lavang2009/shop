import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="glass-card flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center">
      <img
        src={item.imageUrl || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"}
        alt={item.name}
        className="h-28 w-full rounded-2xl object-cover sm:w-28"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold text-slate-900">{item.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-secondary !px-3 !py-2" onClick={() => onDecrease(item.id)} aria-label="Giảm số lượng">
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-10 text-center text-sm font-semibold text-slate-700">{item.quantity}</span>
        <button className="btn-secondary !px-3 !py-2" onClick={() => onIncrease(item.id)} aria-label="Tăng số lượng">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <p className="text-base font-bold text-slate-900">
          {formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}
        </p>
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600" onClick={() => onRemove(item.id)}>
          <Trash2 className="h-4 w-4" />
          Xóa
        </button>
      </div>
    </article>
  );
}
