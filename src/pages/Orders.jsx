import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { Package2, MapPin, Phone, Clock3 } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { formatCurrency, formatDate } from "../utils/format";

export default function Orders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", profile.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(list);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [profile?.uid]);

  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Theo dõi"
        title="Đơn hàng của bạn"
        subtitle="Theo dõi trạng thái và thông tin chi tiết đơn hàng."
      />

      <div className="mt-8">
        {loading ? (
          <LoadingScreen label="Đang tải đơn hàng..." />
        ) : orders.length ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              const status = order.status || "pending";

              return (
                <div
                  key={order.id}
                  className="glass-card rounded-[2rem] p-6"
                >
                  {/* Header */}
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Mã đơn: {order.id}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        <Clock3 className="inline mr-1 h-4 w-4" />
                        {formatDate(order.createdAt) || "—"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        <Phone className="inline mr-1 h-4 w-4" />
                        {order.phone || profile?.phoneNumber || "Chưa có SĐT"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        <MapPin className="inline mr-1 h-4 w-4" />
                        {order.address || "Chưa có địa chỉ"}
                      </p>

                      {order.note && (
                        <p className="mt-1 text-sm text-slate-500">
                          Ghi chú: {order.note}
                        </p>
                      )}
                    </div>

                    {/* Status + total */}
                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : status === "cancelled"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {status === "confirmed"
                          ? "Đã xác nhận"
                          : status === "cancelled"
                          ? "Đã hủy"
                          : "Chờ xác nhận"}
                      </span>

                      <p className="mt-3 text-2xl font-black text-sky-600">
                        {formatCurrency(order.total || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-6 space-y-3">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Package2 className="h-4 w-4 text-slate-500" />
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              SL: {item.quantity || 1}
                            </p>
                          </div>
                        </div>

                        <p className="font-semibold text-slate-700">
                          {formatCurrency(
                            (item.price || 0) * (item.quantity || 1)
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Chưa có đơn hàng nào"
            description="Sau khi mua hàng, đơn sẽ xuất hiện tại đây."
            actionLabel="Đi mua sắm"
            actionTo="/products"
          />
        )}
      </div>
    </section>
  );
}
