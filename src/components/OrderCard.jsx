import { formatCurrency, formatDate } from "../utils/format";

export default function OrderCard({ order }) {
  return (
    <article className="glass-card rounded-[2rem] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Mã đơn</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{order.id}</h3>
          <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">
          {order.status === "pending" ? "Chờ xử lý" : order.status === "done" ? "Hoàn tất" : order.status}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Người nhận</p>
          <p className="mt-2 font-semibold text-slate-900">{order.customerName}</p>
          <p className="text-sm text-slate-500">{order.phone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Giao đến</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{order.address}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Tổng tiền</p>
          <p className="mt-2 text-2xl font-black text-emerald-600">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-5">
        <p className="text-sm font-semibold text-slate-700">Sản phẩm:</p>
        <ul className="mt-3 space-y-3">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 text-sm text-slate-600">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold text-slate-900">{formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
