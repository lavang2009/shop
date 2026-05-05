import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { MapPin, Phone, Clock3 } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import OrderCard from "../components/OrderCard";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { formatDate } from "../utils/format";

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
      where("userId", "==", profile.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        // ✅ sort local (tránh lỗi index)
        list.sort(
          (a, b) =>
            Number(b.createdAt?.seconds || 0) -
            Number(a.createdAt?.seconds || 0)
        );

        setOrders(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsubscribe;
  }, [profile?.uid]);

  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Theo dõi"
        title="Đơn hàng của bạn"
        subtitle="Danh sách đơn đặt hàng và thông tin chi tiết."
      />

      <div className="mt-8">
        {loading ? (
          <LoadingScreen label="Đang tải đơn hàng..." />
        ) : orders.length ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = order.status || "pending";

              return (
                <div key={order.id} className="space-y-3">
                  
                  {/* ✅ Thông tin thêm (KHÔNG phá OrderCard) */}
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p>
                      <Clock3 className="inline mr-1 h-4 w-4" />
                      {formatDate(order.createdAt) || "—"}
                    </p>

                    <p>
                      <Phone className="inline mr-1 h-4 w-4" />
                      {order.phone || profile?.phoneNumber || "Chưa có SĐT"}
                    </p>

                    <p>
                      <MapPin className="inline mr-1 h-4 w-4" />
                      {order.address || "Chưa có địa chỉ"}
                    </p>

                    {order.note && (
                      <p>Ghi chú: {order.note}</p>
                    )}

                    <p className="mt-2 font-semibold">
                      Trạng thái:{" "}
                      <span
                        className={
                          status === "confirmed"
                            ? "text-emerald-600"
                            : status === "cancelled"
                            ? "text-rose-600"
                            : "text-amber-600"
                        }
                      >
                        {status === "confirmed"
                          ? "Đã xác nhận"
                          : status === "cancelled"
                          ? "Đã hủy"
                          : "Chờ xác nhận"}
                      </span>
                    </p>
                  </div>

                  {/* ✅ Giữ nguyên component cũ */}
                  <OrderCard order={order} />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Chưa có đơn hàng nào"
            description="Sau khi checkout, đơn hàng sẽ xuất hiện ở đây."
            actionLabel="Đi mua sắm"
            actionTo="/products"
          />
        )}
      </div>
    </section>
  );
}
