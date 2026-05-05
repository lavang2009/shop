import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "./AuthContext";
import { formatCurrency } from "../utils/format";

const CART_KEY = "freshglow-cart-v2";
const CartContext = createContext(null);

const readCart = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const { user, profile } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) return;
    setItems((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          imageUrl: product.imageUrl || "",
          quantity,
        },
      ];
    });
    toast.success("Đã thêm vào giỏ hàng.");
  };

  const removeFromCart = (id) => setItems((current) => current.filter((item) => item.id !== id));

  const updateQuantity = (id, quantity) => {
    const next = Number(quantity || 1);
    if (next <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((current) => current.map((item) => (item.id === id ? { ...item, quantity: next } : item)));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  const placeOrder = async ({ address, phone, note = "", paymentMethod = "COD", shippingMethod = "Tiêu chuẩn" }) => {
    if (!user || !profile) {
      throw new Error("Vui lòng đăng nhập để đặt hàng.");
    }
    if (!items.length) {
      throw new Error("Giỏ hàng đang trống.");
    }
    if (!address?.trim()) {
      throw new Error("Vui lòng nhập địa chỉ nhận hàng.");
    }

    const payload = {
      userId: profile.uid,
      customerName: profile.displayName || user.displayName || "Người dùng",
      email: profile.email || user.email || "",
      phone: phone || profile.phoneNumber || "",
      address: address.trim(),
      note: note.trim(),
      paymentMethod,
      shippingMethod,
      status: "pending",
      items,
      subtotal,
      shippingFee: shippingMethod === "Hỏa tốc" ? 30000 : 0,
      total: subtotal + (shippingMethod === "Hỏa tốc" ? 30000 : 0),
      createdAt: serverTimestamp(),
    };

    const refDoc = await addDoc(collection(db, "orders"), payload);
    clearCart();
    toast.success(`Đặt hàng thành công: ${refDoc.id}`);
    return refDoc.id;
  };

  const summaryText = useMemo(() => formatCurrency(subtotal), [subtotal]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      summaryText,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
    }),
    [items, itemCount, subtotal, summaryText]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
