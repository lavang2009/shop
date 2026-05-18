import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Star } from "lucide-react";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";

export default function ReviewSection({ productId }) {
  const { user } = useAuth();
  const { submitReview } = useProducts();
  
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "reviews"), 
      where("productId", "==", productId), 
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setBusy(true);
    try {
      await submitReview(productId, rating, comment);
      setComment("");
      setRating(5);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-10 rounded-[2rem] bg-white p-6 md:p-8 shadow-soft ring-1 ring-slate-100">
      <h3 className="text-2xl font-bold text-slate-900">Đánh giá từ khách hàng ({reviews.length})</h3>
      
      {/* Form viết đánh giá */}
      {user ? (
        <form onSubmit={handleSubmit} className="mt-6 rounded-3xl bg-slate-50 p-6 border border-slate-100">
          <p className="text-sm font-semibold text-slate-900 mb-2">Để lại đánh giá của bạn</p>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                onClick={() => setRating(star)} 
                className={`h-6 w-6 cursor-pointer transition ${star <= rating ? "fill-amber-500 text-amber-500" : "text-slate-300"}`} 
              />
            ))}
          </div>
          <textarea 
            rows="3" 
            className="input-field" 
            placeholder="Chia sẻ cảm nhận thật của bạn về sản phẩm..." 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
          />
          <button type="submit" disabled={busy} className="btn-primary mt-3">
            {busy ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      ) : (
        <div className="mt-6 rounded-3xl bg-slate-50 p-6 border border-slate-100 text-center">
          <p className="text-sm text-slate-600">Vui lòng đăng nhập để để lại đánh giá.</p>
        </div>
      )}

      {/* Hiển thị danh sách */}
      <div className="mt-8 space-y-6">
        {reviews.map(rev => (
          <div key={rev.id} className="flex flex-col gap-2 border-b border-slate-100 pb-6 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold">
                {rev.userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">{rev.userName}</span>
                <div className="flex text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-current" : "text-slate-200"}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{rev.comment}</p>
          </div>
        ))}
        {!reviews.length && <p className="text-sm text-slate-500 italic mt-6">Chưa có đánh giá nào cho sản phẩm này.</p>}
      </div>
    </div>
  );
}
