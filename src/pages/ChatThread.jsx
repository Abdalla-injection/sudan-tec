import { useEffect, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ChatThread() {
  const { chatId } = useParams();
  const { currentUser, profile } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getDoc(doc(db, "chats", chatId)).then((snap) => {
      if (!snap.exists()) {
        setDenied(true);
        setLoading(false);
        return;
      }
      const data = { id: snap.id, ...snap.data() };
      if (data.patientId !== currentUser?.uid && data.clinicOwnerId !== currentUser?.uid) {
        setDenied(true);
      } else {
        setChat(data);
      }
      setLoading(false);
    });
  }, [chatId, currentUser]);

  useEffect(() => {
    if (!chat) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [chat, chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText("");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.uid,
      senderRole: profile?.role,
      text: value,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: value,
      lastMessageAt: serverTimestamp(),
    });
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (denied) {
    return <Navigate to="/" replace />;
  }

  const otherName = profile?.role === "provider" ? chat.patientName : chat.clinicName;
  const backTo = profile?.role === "provider" ? "/dashboard/provider" : "/dashboard/patient";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to={backTo} className="text-sm text-teal-800 font-semibold">
        → عودة للوحتي
      </Link>

      <div className="mt-4 bg-white border border-line rounded-2xl flex flex-col h-[70vh] overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-900 text-white grid place-items-center font-display font-bold">
            {otherName?.charAt(0) || "ه"}
          </div>
          <div>
            <p className="font-display font-bold text-ink">{otherName}</p>
            {chat.clinicName && profile?.role === "patient" && (
              <Link to={`/clinic/${chat.clinicId}`} className="text-xs text-teal-700">
                عرض ملف المنشأة
              </Link>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-none">
          {messages.length === 0 && (
            <p className="text-center text-sm text-ink/45 mt-10">
              ابدأ المحادثة بإرسال أول رسالة
            </p>
          )}
          {messages.map((m) => {
            const mine = m.senderId === currentUser.uid;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    mine
                      ? "bg-teal-900 text-white rounded-bl-sm"
                      : "bg-sand-100 text-ink rounded-br-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-line p-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-clay-500 text-white font-semibold text-sm hover:bg-clay-600 transition-colors"
          >
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}
