import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
  UserRound,
  Package2,
  Truck,
  XCircle,
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

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const canManage = ["admin", "seller"].includes(profile?.role || "");

  // 🔥 Load orders realtime
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        toast.error("Lỗi tải đơn hàng");
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  // 🔍 Filter
  const filteredOrders = useMemo(() => {
    const lower = search.toLowerCase();

    return orders.filter((o) => {
      const matchSearch =
        !lower ||
        o.customerName?.toLowerCase().includes(lower) ||
        o.email?.toLowerCase().includes(lower) ||
        o.phone?.toLowerCase().includes(lower) ||
        o.address?.toLowerCase().includes(lower) ||
        o.id?.toLowerCase().includes(lower);

      const matchStatus =
        statusFilter === "all"
          ? true
          : (o.status || "pending") === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  // 🔄 Update trạng thái
  const updateStatus = async (id, status) => {
    try {
      setSavingId(id);
      await updateDoc(doc(db, "orders", id), {
        status,
        updatedAt: serverTimestamp(),
      });
      toast.success("Cập nhật thành công");
    } catch (err) {
      toast.error("Lỗi cập nhật");
    } finally {
      setSavingId("");
    }
  };

  if (loading) return <LoadingScreen label="Đang tải đơn hàng..." />;

  if (!canManage) {
    return (
      <section className="section-shell py-16">
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold">Không có quyền</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell py-10">
      <h1 className="page-title">Quản lý đơn hàng</h1>

      {/* 🔍 Search + Filter */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <input
          className="input-field"
          placeholder="Tìm tên, SĐT, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input-field"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="done">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* 📦 Orders */}
      <div className="mt-8 space-y-6">
        {filteredOrders.map((order) => {
          const status = order.status || "pending";

          return (
            <div key={order.id} className="bg-white p-6 rounded-2xl shadow">

              {/* 👤 THÔNG TIN KHÁCH */}
              <div className="mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <UserRound /> Thông tin khách
                </h2>
                <p>Tên: {order.customerName || "—"}</p>
                <p>Email: {order.email || "—"}</p>
                <p>SĐT: {order.phone || "—"}</p>
                <p>Địa chỉ: {order.address || "—"}</p>
              </div>

              {/* 📦 SẢN PHẨM */}
              <div className="mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Package2 /> Sản phẩm
                </h2>

                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* 💰 */}
              <div className="mb-2">
                Tổng: <b>{formatCurrency(order.total)}</b>
              </div>

              <div className="text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </div>

              {/* 🎯 ACTION */}
              <div className="mt-4 flex flex-wrap gap-2">

                <button
                  onClick={() => updateStatus(order.id, "confirmed")}
                  className="btn-primary"
                  disabled={savingId === order.id}
                >
                  <CheckCircle2 className="w-4 h-4" /> Xác nhận
                </button>

                <button
                  onClick={() => updateStatus(order.id, "shipping")}
                  className="btn-secondary"
                >
                  <Truck className="w-4 h-4" /> Giao hàng
                </button>

                <button
                  onClick={() => updateStatus(order.id, "done")}
                  className="btn-secondary"
                >
                  Hoàn thành
                </button>

                <button
                  onClick={() => updateStatus(order.id, "cancelled")}
                  className="btn-secondary text-red-600"
                >
                  <XCircle className="w-4 h-4" /> Hủy
                </button>
              </div>

              <p className="mt-3">
                Trạng thái: <b>{status}</b>
              </p>
            </div>
          );
        })}

        {!filteredOrders.length && (
          <p className="text-center text-gray-500">
            Không có đơn hàng
          </p>
        )}
      </div>
    </section>
  );
}
