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

  const {
    role: extraRole,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    uid: _uid,
    ...rest
  } = extra;

  const currentRole = snap.exists() ? snap.data()?.role : null;

  const payload = {
    uid: user.uid,
    email: user.email || rest.email || "",
    phoneNumber: user.phoneNumber || rest.phoneNumber || "",
    displayName: user.displayName || rest.displayName || "",
    photoURL: user.photoURL || rest.photoURL || "",
    role: currentRole || extraRole || "customer",
    updatedAt: serverTimestamp(),
    ...rest,
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
      try {
        setUser(firebaseUser || null);

        if (!firebaseUser) {
          setProfile(null);
          return;
        }

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
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const registerWithEmail = async ({
    displayName,
    email,
    password,
    phoneNumber,
  }) => {
    const cleanName = (displayName || "").trim();
    const cleanEmail = (email || "").trim();

    const credential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

    await updateProfile(credential.user, {
      displayName: cleanName,
    });

    const payload = await upsertUserProfile(credential.user, {
      displayName: cleanName,
      email: cleanEmail,
      phoneNumber: phoneNumber || "",
      role: "customer",
    });

    setProfile(payload);
    return credential.user;
  };

  const loginWithEmail = async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    return credential.user;
  };

  const saveProfile = async (extra = {}) => {
    if (!auth.currentUser) return null;

    const nextDisplayName =
      extra.displayName?.trim() || auth.currentUser.displayName || "";

    if (extra.displayName) {
      await updateProfile(auth.currentUser, {
        displayName: nextDisplayName,
      });
    }

    const payload = await upsertUserProfile(auth.currentUser, {
      displayName: nextDisplayName,
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
    setUser(null);
    setProfile(null);
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return ctx;
};
