import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const typeLabel = { clinic: "عيادة خاصة", hospital: "مستشفى" };

export default function ClinicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingErr, setBookingErr] = useState("");

  useEffect(() => {
    let active = true;
    getDoc(doc(db, "clinics", id))
      .then((snap) => {
        if (!active) return;
        if (snap.exists()) setClinic({ id: snap.id, ...snap.data() });
        else setNotFound(true);
      })
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  async function handleBook(e) {
    e.preventDefault();
    setBookingErr("");
    setBookingMsg("");

    if (!currentUser) {
      navigate("/login", { state: { from: { pathname: `/clinic/${id}` } } });
      return;
    }
    if (profile?.role !== "patient") {
      setBookingErr("الحجز متاح لحسابات المرضى فقط.");
      return;
    }
    if (!date || !time) {
      setBookingErr("الرجاء اختيار التاريخ والوقت.");
      return;
    }

    setBooking(true);
    try {
      await addDoc(collection(db, "appointments"), {
        clinicId: clinic.id,
        clinicName: clinic.name,
        patientId: currentUser.uid,
        patientName: profile?.name || currentUser.displayName || "",
        patientPhone: profile?.phone || "",
        date,
        time,
        notes,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setBookingMsg("تم إرسال طلب الحجز بنجاح. ستصلك حالة التأكيد في لوحتك.");
      setDate("");
      setTime("");
      setNotes("");
    } catch (err) {
      console.error(err);
      setBookingErr("تعذر إرسال الحجز، حاول مرة أخرى.");
    } finally {
      setBooking(false);
    }
  }

  async function handleStartChat() {
    if (!currentUser) {
      navigate("/login", { state: { from: { pathname: `/clinic/${id}` } } });
      return;
    }
    if (profile?.role !== "patient") return;

    const chatId = `${currentUser.uid}_${clinic.id}`;
    const chatRef = doc(db, "chats", chatId);
    const snap = await getDoc(chatRef);
    if (!snap.exists()) {
      await setDoc(chatRef, {
        patientId: currentUser.uid,
        patientName: profile?.name || "",
        clinicId: clinic.id,
        clinicOwnerId: clinic.ownerId,
        clinicName: clinic.name,
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }
    navigate(`/chat/${chatId}`);
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display font-extrabold text-2xl text-ink">
          لم يتم العثور على هذه المنشأة
        </h1>
        <Link to="/search" className="text-teal-800 font-semibold mt-4 inline-block">
          عودة إلى نتائج البحث ←
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-teal-900 text-white grid place-items-center font-display font-extrabold text-2xl">
            {clinic.name?.charAt(0) || "ه"}
          </div>
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800">
              {typeLabel[clinic.type] || clinic.type}
            </span>
            <h1 className="font-display font-extrabold text-3xl text-ink mt-2">
              {clinic.name}
            </h1>
            <p className="text-ink/60 mt-1">{clinic.specialty} · {clinic.city}</p>
          </div>
        </div>

        {clinic.description && (
          <div className="mt-8">
            <h2 className="font-display font-bold text-lg text-ink mb-2">نبذة</h2>
            <p className="text-ink/70 leading-relaxed">{clinic.description}</p>
          </div>
        )}

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-line rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-ink/50 mb-1">العنوان</h3>
            <p className="text-ink font-medium">{clinic.address || "—"}، {clinic.city}</p>
          </div>
          <div className="bg-white border border-line rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-ink/50 mb-1">رقم الهاتف</h3>
            <p className="text-ink font-medium" dir="ltr">{clinic.phone || "—"}</p>
          </div>
          <div className="bg-white border border-line rounded-2xl p-5 sm:col-span-2">
            <h3 className="text-sm font-semibold text-ink/50 mb-1">مواعيد العمل</h3>
            <p className="text-ink font-medium">{clinic.workingHours || "غير محدد"}</p>
          </div>
        </div>

        <button
          onClick={handleStartChat}
          className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-teal-800 text-teal-900 font-semibold hover:bg-teal-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          راسل العيادة مباشرة
        </button>
      </div>

      {/* Booking card */}
      <aside className="lg:sticky lg:top-24 h-fit bg-white border border-line rounded-2xl p-6 shadow-card">
        <h2 className="font-display font-bold text-lg text-ink mb-4">احجز موعدك</h2>
        <form onSubmit={handleBook} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-ink/70 block mb-1">التاريخ</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70 block mb-1">الوقت</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70 block mb-1">ملاحظات (اختياري)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="اذكر سبب الزيارة أو أي تفاصيل مهمة"
              className="w-full px-3 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 resize-none"
            />
          </div>

          {bookingErr && (
            <p className="text-sm text-danger bg-danger-100 rounded-lg px-3 py-2">{bookingErr}</p>
          )}
          {bookingMsg && (
            <p className="text-sm text-teal-800 bg-teal-50 rounded-lg px-3 py-2">{bookingMsg}</p>
          )}

          <button
            type="submit"
            disabled={booking}
            className="w-full py-3 rounded-xl bg-clay-500 text-white font-semibold hover:bg-clay-600 transition-colors disabled:opacity-60"
          >
            {booking ? "جارٍ الإرسال…" : "تأكيد طلب الحجز"}
          </button>

          {!currentUser && (
            <p className="text-xs text-ink/50 text-center">
              ستحتاج لتسجيل الدخول لإتمام الحجز
            </p>
          )}
        </form>
      </aside>
    </div>
  );
}
