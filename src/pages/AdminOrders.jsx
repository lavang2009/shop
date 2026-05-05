import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, ShieldCheck, Clock3 } from "lucide-react";
import toast from "react-hot-toast";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { formatCurrency, formatDate } from "../utils/format";

export default function AdminOrders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const canManage = ["admin", "seller"].includes(profile?.role || "");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setOrders(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Không tải được danh sách đơn hàng.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    const lower = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !lower ||
        order.userName?.toLowerCase().includes(lower) ||
        order.userEmail?.toLowerCase().includes(lower) ||
        order.status?.toLowerCase().includes(lower) ||
        order.id?.toLowerCase().includes(lower);

      const matchesStatus =
        statusFilter === "all" ? true : (order.status || "pending") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const confirmOrder = async (orderId) => {
    try {
      setSavingId(orderId);
      await updateDoc(doc(db, "orders", orderId), {
        status: "confirmed",
        confirmedAt: serverTimestamp(),
      });
      toast.success("Đã xác nhận đơn hàng.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể xác nhận đơn.");
    } finally {
      setSavingId("");
    }
  };

  if (loading) return <LoadingScreen label="Đang tải đơn hàng..." />;

  if (!canManage) {
    return (
      <section className="section-shell py-16">
        <div className="glass-card rounded-[2rem] p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <ShieldCheck className="h-4 w-4" />
            Quản lý đơn hàng
          </div>
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Bạn chưa có quyền truy cập
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Trang này chỉ dành cho tài khoản có role <strong>seller</strong> hoặc{" "}
            <strong>admin</strong>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="page-title">Quản lý đơn hàng</h1>
          <p className="page-subtitle">
            Xem người dùng đã đặt hàng và xác nhận đơn ngay tại đây.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Role: {profile?.role || "customer"}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="glass-card rounded-[2rem] p-5">
          <p className="text-sm text-slate-500">Tổng đơn</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{orders.length}</p>
        </div>
        <div className="glass-card rounded-[2rem] p-5">
          <p className="text-sm text-slate-500">Chờ xác nhận</p>
          <p className="mt-2 text-3xl font-black text-amber-600">
            {orders.filter((o) => (o.status || "pending") === "pending").length}
          </p>
        </div>
        <div className="glass-card rounded-[2rem] p-5">
          <p className="text-sm text-slate-500">Đã xác nhận</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">
            {orders.filter((o) => o.status === "confirmed").length}
          </p>
        </div>
      </div>

      <div className="mt-8 glass-card rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input-field pl-11"
              placeholder="Tìm theo tên, email, mã đơn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="input-field min-w-[180px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const status = order.status || "pending";

            return (
              <div
                key={order.id}
                className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {order.userName || "Khách hàng"}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : status === "cancelled"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <Clock3 className="h-3.5 w-3.5" />
                        {status === "confirmed"
                          ? "Đã xác nhận"
                          : status === "cancelled"
                          ? "Đã hủy"
                          : "Chờ xác nhận"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Email: {order.userEmail || "—"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Mã đơn: <span className="font-medium text-slate-700">{order.id}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Ngày đặt: {formatDate(order.createdAt) || "—"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">Tổng tiền</p>
                    <p className="text-2xl font-black text-sky-600">
                      {formatCurrency(order.total || 0)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {items.map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-slate-500">
                          SL: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-700">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={savingId === order.id || status === "confirmed"}
                    onClick={() => confirmOrder(order.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {savingId === order.id
                      ? "Đang xác nhận..."
                      : status === "confirmed"
                      ? "Đã xác nhận"
                      : "Xác nhận đơn"}
                  </button>
                </div>
              </div>
            );
          })}

          {!filteredOrders.length ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Chưa có đơn hàng phù hợp.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
