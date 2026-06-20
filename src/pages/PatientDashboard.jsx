import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { APPOINTMENT_STATUS } from "../constants";

function statusBadge(status) {
  const s = APPOINTMENT_STATUS[status] || APPOINTMENT_STATUS.pending;
  const map = {
    clay: "bg-clay-100 text-clay-700",
    teal: "bg-teal-100 text-teal-800",
    danger: "bg-danger-100 text-danger",
    ink: "bg-sand-200 text-ink/70",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[s.color]}`}>
      {s.label}
    </span>
  );
}

export default function PatientDashboard() {
  const { currentUser, profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [chats, setChats] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "appointments"), where("patientId", "==", currentUser.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setAppointments(list);
        setLoadingAppts(false);
      },
      () => setLoadingAppts(false)
    );
    return unsub;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "chats"), where("patientId", "==", currentUser.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0));
        setChats(list);
        setLoadingChats(false);
      },
      () => setLoadingChats(false)
    );
    return unsub;
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-extrabold text-3xl text-ink">
        أهلاً، {profile?.name || ""}
      </h1>
      <p className="text-ink/55 mt-1">تابع حجوزاتك ومحادثاتك من هنا</p>

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Appointments */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-ink">حجوزاتي</h2>
            <Link to="/search" className="text-sm font-semibold text-clay-700">
              + حجز جديد
            </Link>
          </div>

          {loadingAppts && (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-white border border-line animate-pulse" />
              ))}
            </div>
          )}

          {!loadingAppts && appointments.length === 0 && (
            <div className="bg-white border border-dashed border-line rounded-2xl p-10 text-center">
              <p className="font-display font-bold text-ink">لا توجد حجوزات بعد</p>
              <p className="text-sm text-ink/55 mt-1.5">
                ابحث عن عيادة قريبة منك واحجز موعدك الأول.
              </p>
              <Link
                to="/search"
                className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-teal-900 text-white text-sm font-semibold hover:bg-teal-800 transition-colors"
              >
                تصفح العيادات
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="bg-white border border-line rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link to={`/clinic/${a.clinicId}`} className="font-display font-bold text-ink hover:text-teal-900 truncate block">
                    {a.clinicName}
                  </Link>
                  <p className="text-sm text-ink/55 mt-1">
                    {a.date} — {a.time}
                  </p>
                  {a.notes && <p className="text-sm text-ink/50 mt-1 line-clamp-1">{a.notes}</p>}
                </div>
                {statusBadge(a.status)}
              </div>
            ))}
          </div>
        </section>

        {/* Chats */}
        <section>
          <h2 className="font-display font-bold text-lg text-ink mb-4">محادثاتي</h2>

          {loadingChats && (
            <div className="h-20 rounded-2xl bg-white border border-line animate-pulse" />
          )}

          {!loadingChats && chats.length === 0 && (
            <div className="bg-white border border-dashed border-line rounded-2xl p-6 text-center">
              <p className="text-sm text-ink/55">لا توجد محادثات بعد</p>
            </div>
          )}

          <div className="space-y-2">
            {chats.map((c) => (
              <Link
                key={c.id}
                to={`/chat/${c.id}`}
                className="block bg-white border border-line rounded-2xl p-4 hover:border-teal-200 transition-colors"
              >
                <p className="font-semibold text-ink truncate">{c.clinicName}</p>
                <p className="text-sm text-ink/50 truncate mt-0.5">
                  {c.lastMessage || "ابدأ المحادثة الآن"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
