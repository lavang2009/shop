import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext(null);

export async function upsertUserProfile(user, extra = {}) {
  if (!user?.uid) return null;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const { role: extraRole, ...rest } = extra;
  const payload = {
    uid: user.uid,
    email: user.email || rest.email || "",
    phoneNumber: user.phoneNumber || rest.phoneNumber || "",
    displayName: user.displayName || rest.displayName || "",
    photoURL: user.photoURL || rest.photoURL || "",
    updatedAt: serverTimestamp(),
    ...rest,
    role: snap.exists() ? snap.data()?.role || extraRole || "customer" : extraRole || "customer",
  };

  if (!snap.exists()) {
    await setDoc(userRef, {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } else {
    await setDoc(userRef, payload, { merge: true });
  }

  return payload;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser || null);

      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            const created = await upsertUserProfile(firebaseUser, {
              displayName: firebaseUser.displayName || "Người dùng",
              email: firebaseUser.email || "",
              phoneNumber: firebaseUser.phoneNumber || "",
              role: "customer",
            });
            setProfile(created);
          }
        } catch (error) {
          console.error(error);
          toast.error("Không tải được hồ sơ người dùng.");
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerWithEmail = async ({ displayName, email, password, phoneNumber }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    const payload = await upsertUserProfile(credential.user, {
      displayName,
      email,
      phoneNumber: phoneNumber || "",
      role: "customer",
    });
    setProfile(payload);
    return credential.user;
  };

  const loginWithEmail = async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const saveProfile = async (extra = {}) => {
    if (!auth.currentUser) return null;
    if (extra.displayName) {
      await updateProfile(auth.currentUser, { displayName: extra.displayName });
    }
    const payload = await upsertUserProfile(auth.currentUser, {
      displayName: extra.displayName || auth.currentUser.displayName || "",
      email: auth.currentUser.email || "",
      phoneNumber: auth.currentUser.phoneNumber || "",
      ...extra,
    });
    setProfile(payload);
    return payload;
  };

  const refreshProfile = async () => {
    if (!auth.currentUser) return null;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (snap.exists()) {
      setProfile(snap.data());
      return snap.data();
    }
    return null;
  };

  const logout = async () => {
    await signOut(auth);
    toast.success("Đã đăng xuất.");
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      registerWithEmail,
      loginWithEmail,
      saveProfile,
      refreshProfile,
      logout,
      upsertUserProfile,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
