import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "./AuthContext";
import { uploadImage } from "../services/uploadImage";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const { profile } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Không tải được danh sách sản phẩm.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const canManageProducts = ["admin", "seller"].includes(profile?.role || "");

  const addProduct = async (data) => {
    if (!canManageProducts) {
      throw new Error("Bạn không có quyền thêm sản phẩm.");
    }

    let imageUrl = data.imageUrl || "";

    if (data.imageFile) {
      imageUrl = await uploadImage(data.imageFile);
    }

    const payload = {
      name: data.name?.trim() || "",
      price: Number(data.price || 0),
      stock: Number(data.stock || 0), // Thêm số lượng kho
      rating: 0, // Mặc định 0 sao
      reviewCount: 0, // Mặc định 0 đánh giá
      shortDescription: data.shortDescription?.trim() || "",
      description: data.description?.trim() || "",
      category: data.category?.trim() || "Sữa rửa mặt",
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      authorId: profile?.uid || "",
      authorName: profile?.displayName || "",
      authorRole: profile?.role || "customer",
    };

    const docRef = await addDoc(collection(db, "products"), payload);
    toast.success("Đã thêm sản phẩm mới.");
    return docRef.id;
  };

  const updateProduct = async (id, data) => {
    if (!canManageProducts) {
      throw new Error("Bạn không có quyền chỉnh sửa sản phẩm.");
    }

    const refDoc = doc(db, "products", id);
    const current = await getDoc(refDoc);

    if (!current.exists()) {
      throw new Error("Không tìm thấy sản phẩm để cập nhật.");
    }

    const currentData = current.data();

    let imageUrl = currentData.imageUrl || "";

    if (data.imageFile) {
      imageUrl = await uploadImage(data.imageFile);
    } else if (data.imageUrl) {
      imageUrl = data.imageUrl;
    }

    const payload = {
      name: data.name?.trim() || "",
      price: Number(data.price || 0),
      stock: Number(data.stock || 0), // Cập nhật số lượng kho
      shortDescription: data.shortDescription?.trim() || "",
      description: data.description?.trim() || "",
      category: data.category?.trim() || "Sữa rửa mặt",
      imageUrl,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(refDoc, payload);
    toast.success("Đã cập nhật sản phẩm.");
  };

  const removeProduct = async (id) => {
    if (!canManageProducts) {
      throw new Error("Bạn không có quyền xóa sản phẩm.");
    }

    await deleteDoc(doc(db, "products", id));
    toast.success("Đã xóa sản phẩm.");
  };

  const getProductById = async (id) => {
    const snap = await getDoc(doc(db, "products", id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  };

  const getRelatedProducts = (currentId, limit = 4) =>
    products.filter((item) => item.id !== currentId).slice(0, limit);

  // 🔥 HÀM MỚI: Gửi đánh giá và tính lại sao trung bình
  const submitReview = async (productId, ratingScore, commentText) => {
    if (!profile) throw new Error("Vui lòng đăng nhập để đánh giá.");

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) throw new Error("Sản phẩm không tồn tại.");
    
    const productData = productSnap.data();
    const currentCount = productData.reviewCount || 0;
    const currentRating = productData.rating || 0;

    // Tính điểm trung bình mới
    const newCount = currentCount + 1;
    const newRating = ((currentRating * currentCount) + ratingScore) / newCount;

    // 1. Lưu đánh giá
    await addDoc(collection(db, "reviews"), {
      productId,
      userId: profile.uid,
      userName: profile.displayName || "Người dùng",
      rating: ratingScore,
      comment: commentText.trim(),
      createdAt: serverTimestamp()
    });

    // 2. Cập nhật lại số sao của sản phẩm
    await updateDoc(productRef, {
      rating: newRating,
      reviewCount: newCount
    });

    toast.success("Cảm ơn bạn đã gửi đánh giá!");
  };

  const value = useMemo(
    () => ({
      products,
      loading,
      canManageProducts,
      addProduct,
      updateProduct,
      removeProduct,
      getProductById,
      getRelatedProducts,
      submitReview, // Xuất hàm mới ra
    }),
    [products, loading, canManageProducts]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export const useProducts = () => useContext(ProductContext);
