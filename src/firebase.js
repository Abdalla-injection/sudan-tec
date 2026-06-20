// إعدادات فايربيز الخاصة بمشروعك
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjmUxCXWc7-l_DhLUpGM2zS_P3AGs9RWo",
  authDomain: "hiba-5fee8.firebaseapp.com",
  projectId: "hiba-5fee8",
  storageBucket: "hiba-5fee8.firebasestorage.app",
  messagingSenderId: "153429115716",
  appId: "1:153429115716:web:29c7468ebca4228b148d11",
  measurementId: "G-KCNLBR6B8W",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
