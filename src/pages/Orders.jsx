import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import OrderCard from "../components/OrderCard";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";

export default function Orders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.uid) {
      setLoading(false);
      return undefined;
    }
    const q = query(collection(db, "orders"), where("userId", "==", profile.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        list.sort((a, b) => Number(b.createdAt?.seconds || 0) - Number(a.createdAt?.seconds || 0));
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
        subtitle="Danh sách đơn đặt hàng được lưu trong Firestore, giúp người dùng dễ kiểm tra trạng thái đơn."
      />

      <div className="mt-8">
        {loading ? <LoadingScreen label="Đang tải đơn hàng..." /> : orders.length ? <div className="space-y-5">{orders.map((order) => <OrderCard key={order.id} order={order} />)}</div> : <EmptyState title="Chưa có đơn hàng nào" description="Sau khi checkout, đơn hàng sẽ xuất hiện ở đây để bạn theo dõi." actionLabel="Đi mua sắm" actionTo="/products" />}
      </div>
    </section>
  );
}
