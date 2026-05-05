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
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { useAuth } from "./AuthContext";

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

    return unsubscribe;
  }, []);

  const canManageProducts = ["admin", "seller"].includes(profile?.role || "");

  const uploadImage = async (file) => {
    if (!file) return { imageUrl: "", imagePath: "" };
    const path = `products/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    return { imageUrl, imagePath: path };
  };

  const addProduct = async (data) => {
    if (!canManageProducts) {
      throw new Error("Bạn không có quyền thêm sản phẩm.");
    }

    const uploaded = data.imageFile ? await uploadImage(data.imageFile) : { imageUrl: "", imagePath: "" };
    const payload = {
      name: data.name,
      price: Number(data.price),
      shortDescription: data.shortDescription || "",
      description: data.description || "",
      category: data.category || "Sữa rửa mặt",
      imageUrl: uploaded.imageUrl || data.imageUrl || "",
      imagePath: uploaded.imagePath || data.imagePath || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      authorId: profile?.uid || "",
      authorName: profile?.displayName || "",
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
    const currentData = current.exists() ? current.data() : {};

    let imageUrl = currentData.imageUrl || "";
    let imagePath = currentData.imagePath || "";

    if (data.imageFile) {
      if (imagePath) {
        try {
          await deleteObject(ref(storage, imagePath));
        } catch (error) {
          console.warn("Không xóa được ảnh cũ:", error);
        }
      }
      const uploaded = await uploadImage(data.imageFile);
      imageUrl = uploaded.imageUrl;
      imagePath = uploaded.imagePath;
    }

    const payload = {
      name: data.name,
      price: Number(data.price),
      shortDescription: data.shortDescription || "",
      description: data.description || "",
      category: data.category || "Sữa rửa mặt",
      imageUrl,
      imagePath,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(refDoc, payload);
    toast.success("Đã cập nhật sản phẩm.");
  };

  const removeProduct = async (id) => {
    if (!canManageProducts) {
      throw new Error("Bạn không có quyền xóa sản phẩm.");
    }

    const refDoc = doc(db, "products", id);
    const snap = await getDoc(refDoc);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.imagePath) {
        try {
          await deleteObject(ref(storage, data.imagePath));
        } catch (error) {
          console.warn("Không xóa được ảnh trên Storage:", error);
        }
      }
      await deleteDoc(refDoc);
    }
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

  const value = useMemo(
    () => ({
      products,
      loading,
      canManageProducts,
      uploadImage,
      addProduct,
      updateProduct,
      removeProduct,
      getProductById,
      getRelatedProducts,
    }),
    [products, loading, canManageProducts]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export const useProducts = () => useContext(ProductContext);
