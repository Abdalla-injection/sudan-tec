import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        } catch (e) {
          console.error(e);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function registerPatient({ name, email, phone, password }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const userDoc = {
      role: "patient",
      name,
      email,
      phone,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", cred.user.uid), userDoc);
    setProfile({ id: cred.user.uid, ...userDoc });
    return cred.user;
  }

  async function registerProvider({
    name,
    email,
    phone,
    password,
    facilityName,
    facilityType,
    specialty,
    city,
    address,
    description,
    workingHours,
  }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const userDoc = {
      role: "provider",
      name,
      email,
      phone,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", cred.user.uid), userDoc);

    const clinicDoc = {
      ownerId: cred.user.uid,
      name: facilityName,
      type: facilityType,
      specialty,
      city,
      address,
      phone,
      description: description || "",
      workingHours: workingHours || "",
      rating: 0,
      ratingCount: 0,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "clinics", cred.user.uid), clinicDoc);

    setProfile({ id: cred.user.uid, ...userDoc });
    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    return cred.user;
  }

  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    profile,
    loading,
    registerPatient,
    registerProvider,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
