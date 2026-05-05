import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
  UserRound,
  Package2,
} from "lucide-react";
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
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const canManage = ["admin", "seller"].includes(profile?.role || "");

  useEffect(() => {
    const unsubUsers = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setUsers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      },
      (error) => {
        console.error(error);
        toast.error("Không tải được danh sách người dùng.");
      }
    );

    const unsubOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
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

    return () => {
      unsubUsers();
      unsubOrders();
    };
  }, []);

  const ordersByUserId = useMemo(() => {
    return orders.reduce((acc, order) => {
      const key = order.userId || "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {});
  }, [orders]);

  const filteredUsers = useMemo(() => {
    const lower = search.trim().toLowerCase();

    return users.filter((user) => {
      const userOrders = ordersByUserId[user.id] || [];

      const matchesSearch =
        !lower ||
        user.displayName?.toLowerCase().includes(lower) ||
        user.email?.toLowerCase().includes(lower) ||
        user.phoneNumber?.toLowerCase().includes(lower) ||
        user.role?.toLowerCase().includes(lower) ||
        user.id?.toLowerCase().includes(lower) ||
        userOrders.some((order) => {
          return (
            order.id?.toLowerCase().includes(lower) ||
            order.status?.toLowerCase().includes(lower)
          );
        });

      const matchesStatus =
        statusFilter === "all"
          ? true
          : userOrders.some((order) => (order.status || "pending") === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [users, ordersByUserId, search, statusFilter]);

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
          <h1 className="page-title">Quản lý người dùng và đơn hàng</h1>
          <p className="page-subtitle">
            Hiển thị toàn bộ hồ sơ người dùng kèm danh sách đơn hàng của họ.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Role: {profile?.role || "customer"}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="glass-card rounded-[2rem] p-5">
          <p className="text-sm text-slate-500">Tổng người dùng</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{users.length}</p>
        </div>
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
              placeholder="Tìm tên, email, số điện thoại, mã đơn..."
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

        <div className="mt-6 space-y-6">
          {filteredUsers.map((user) => {
            const userOrders = ordersByUserId[user.id] || [];

            const visibleOrders =
              statusFilter === "all"
                ? userOrders
                : userOrders.filter((order) => (order.status || "pending") === statusFilter);

            return (
              <div
                key={user.id}
                className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {user.displayName || "Chưa có tên"}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {user.role || "customer"}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium text-slate-700">UID:</span> {user.id}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Email:</span>{" "}
                          {user.email || "—"}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Số điện thoại:</span>{" "}
                          {user.phoneNumber || "—"}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Ngày tạo:</span>{" "}
                          {formatDate(user.createdAt) || "—"}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Cập nhật:</span>{" "}
                          {formatDate(user.updatedAt) || "—"}
                        </p>
                      </div>

                      <details className="mt-4 rounded-2xl bg-slate-50 p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                          Xem toàn bộ dữ liệu người dùng
                        </summary>
                        <pre className="mt-3 overflow-auto rounded-2xl bg-white p-4 text-xs leading-6 text-slate-600">
{JSON.stringify(user, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">
                      <Package2 className="mr-2 inline-block h-4 w-4" />
                      Đơn hàng: {userOrders.length}
                    </p>
                    <p className="mt-2">
                      Chờ xác nhận:{" "}
                      {userOrders.filter((o) => (o.status || "pending") === "pending").length}
                    </p>
                    <p className="mt-1">
                      Đã xác nhận: {userOrders.filter((o) => o.status === "confirmed").length}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {visibleOrders.length ? (
                    visibleOrders.map((order) => {
                      const items = Array.isArray(order.items) ? order.items : [];
                      const status = order.status || "pending";

                      return (
                        <div
                          key={order.id}
                          className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-lg font-bold text-slate-900">
                                  Mã đơn: {order.id}
                                </h4>
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
                                Ngày đặt: {formatDate(order.createdAt) || "—"}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                Địa chỉ: {order.address || "—"}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                Ghi chú: {order.note || "—"}
                              </p>

                              <details className="mt-4 rounded-2xl bg-white p-4">
                                <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                                  Xem toàn bộ dữ liệu đơn hàng
                                </summary>
                                <pre className="mt-3 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-600">
{JSON.stringify(order, null, 2)}
                                </pre>
                              </details>
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
                                className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm"
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
                    })
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                      Chưa có đơn hàng phù hợp.
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {!filteredUsers.length ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Không có người dùng phù hợp.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
