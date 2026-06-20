import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { CITIES, SPECIALTIES, FACILITY_TYPES, APPOINTMENT_STATUS } from "../constants";

const TABS = [
  { key: "appointments", label: "الحجوزات" },
  { key: "chats", label: "المحادثات" },
  { key: "profile", label: "ملف المنشأة" },
];

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

export default function ProviderDashboard() {
  const { currentUser, profile } = useAuth();
  const [tab, setTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [chats, setChats] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, "clinics", currentUser.uid)).then((snap) => {
      if (snap.exists()) setClinic({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "appointments"), where("clinicId", "==", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setAppointments(list);
    });
    return unsub;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "chats"), where("clinicOwnerId", "==", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0));
      setChats(list);
    });
    return unsub;
  }, [currentUser]);

  async function updateStatus(id, status) {
    await updateDoc(doc(db, "appointments", id), { status });
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      await updateDoc(doc(db, "clinics", currentUser.uid), {
        name: clinic.name,
        type: clinic.type,
        specialty: clinic.specialty,
        city: clinic.city,
        address: clinic.address,
        phone: clinic.phone,
        description: clinic.description,
        workingHours: clinic.workingHours,
      });
      setSaveMsg("تم حفظ التغييرات بنجاح.");
    } catch (err) {
      console.error(err);
      setSaveMsg("تعذر الحفظ، حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700";
  const labelCls = "text-sm font-medium text-ink/70 block mb-1.5";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-extrabold text-3xl text-ink">
        لوحة {clinic?.name || profile?.name || ""}
      </h1>
      <p className="text-ink/55 mt-1">إدارة حجوزاتك ومحادثاتك وملف منشأتك</p>

      <div className="flex gap-1 mt-6 bg-white border border-line rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-teal-900 text-white" : "text-ink/60 hover:text-teal-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "appointments" && (
        <div className="mt-6 space-y-3">
          {appointments.length === 0 && (
            <div className="bg-white border border-dashed border-line rounded-2xl p-10 text-center text-ink/55">
              لا توجد طلبات حجز حتى الآن.
            </div>
          )}
          {appointments.map((a) => (
            <div key={a.id} className="bg-white border border-line rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-display font-bold text-ink">{a.patientName}</p>
                  <p className="text-sm text-ink/55 mt-1">
                    {a.date} — {a.time} {a.patientPhone && <span dir="ltr"> · {a.patientPhone}</span>}
                  </p>
                  {a.notes && <p className="text-sm text-ink/60 mt-1.5">{a.notes}</p>}
                </div>
                {statusBadge(a.status)}
              </div>
              {a.status === "pending" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(a.id, "confirmed")}
                    className="px-4 py-2 rounded-lg bg-teal-900 text-white text-sm font-semibold hover:bg-teal-800"
                  >
                    تأكيد الموعد
                  </button>
                  <button
                    onClick={() => updateStatus(a.id, "cancelled")}
                    className="px-4 py-2 rounded-lg bg-danger-100 text-danger text-sm font-semibold hover:bg-danger/10"
                  >
                    إلغاء
                  </button>
                </div>
              )}
              {a.status === "confirmed" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(a.id, "completed")}
                    className="px-4 py-2 rounded-lg bg-sand-200 text-ink text-sm font-semibold hover:bg-sand-200/70"
                  >
                    تمّ الكشف
                  </button>
                  <button
                    onClick={() => updateStatus(a.id, "cancelled")}
                    className="px-4 py-2 rounded-lg bg-danger-100 text-danger text-sm font-semibold hover:bg-danger/10"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "chats" && (
        <div className="mt-6 space-y-2">
          {chats.length === 0 && (
            <div className="bg-white border border-dashed border-line rounded-2xl p-10 text-center text-ink/55">
              لا توجد محادثات بعد.
            </div>
          )}
          {chats.map((c) => (
            <Link
              key={c.id}
              to={`/chat/${c.id}`}
              className="block bg-white border border-line rounded-2xl p-4 hover:border-teal-200 transition-colors"
            >
              <p className="font-semibold text-ink">{c.patientName}</p>
              <p className="text-sm text-ink/50 truncate mt-0.5">
                {c.lastMessage || "لا توجد رسائل بعد"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {tab === "profile" && clinic && (
        <form onSubmit={saveProfile} className="mt-6 bg-white border border-line rounded-2xl p-6 space-y-4 max-w-2xl">
          <div>
            <label className={labelCls}>اسم المنشأة</label>
            <input value={clinic.name} onChange={(e) => setClinic({ ...clinic, name: e.target.value })} className={inputCls} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>نوع المنشأة</label>
              <select value={clinic.type} onChange={(e) => setClinic({ ...clinic, type: e.target.value })} className={inputCls}>
                {FACILITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>التخصص</label>
              <select value={clinic.specialty} onChange={(e) => setClinic({ ...clinic, specialty: e.target.value })} className={inputCls}>
                {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>المدينة</label>
              <select value={clinic.city} onChange={(e) => setClinic({ ...clinic, city: e.target.value })} className={inputCls}>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>الهاتف</label>
              <input value={clinic.phone} onChange={(e) => setClinic({ ...clinic, phone: e.target.value })} className={inputCls} dir="ltr" />
            </div>
          </div>
          <div>
            <label className={labelCls}>العنوان</label>
            <input value={clinic.address} onChange={(e) => setClinic({ ...clinic, address: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>مواعيد العمل</label>
            <input value={clinic.workingHours} onChange={(e) => setClinic({ ...clinic, workingHours: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>نبذة</label>
            <textarea rows={3} value={clinic.description} onChange={(e) => setClinic({ ...clinic, description: e.target.value })} className={`${inputCls} resize-none`} />
          </div>

          {saveMsg && <p className="text-sm text-teal-800 bg-teal-50 rounded-lg px-3 py-2">{saveMsg}</p>}

          <button
            type="submit" disabled={saving}
            className="px-6 py-3 rounded-xl bg-teal-900 text-white font-semibold hover:bg-teal-800 transition-colors disabled:opacity-60"
          >
            {saving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </button>
        </form>
      )}
    </div>
  );
}
