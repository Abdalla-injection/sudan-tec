import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CITIES, SPECIALTIES, FACILITY_TYPES } from "../constants";
import Logo from "../components/Logo";

const ERROR_MAP = {
  "auth/email-already-in-use": "هذا البريد الإلكتروني مستخدم بالفعل.",
  "auth/invalid-email": "صيغة البريد الإلكتروني غير صحيحة.",
  "auth/weak-password": "كلمة المرور ضعيفة، استخدم 6 أحرف على الأقل.",
};

const initial = {
  name: "",
  email: "",
  phone: "",
  password: "",
  facilityName: "",
  facilityType: "clinic",
  specialty: SPECIALTIES[0],
  city: CITIES[0],
  address: "",
  description: "",
  workingHours: "",
};

export default function RegisterProvider() {
  const { registerProvider } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerProvider(form);
      navigate("/dashboard/provider", { replace: true });
    } catch (err) {
      setError(ERROR_MAP[err.code] || "تعذر إنشاء الحساب، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700";
  const labelCls = "text-sm font-medium text-ink/70 block mb-1.5";

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-white border border-line rounded-2xl shadow-card p-7 sm:p-8">
          <h1 className="font-display font-extrabold text-2xl text-ink text-center">
            تسجيل عيادة أو مستشفى
          </h1>
          <p className="text-sm text-ink/55 text-center mt-1.5">
            استقبل حجوزات المرضى وتواصل معهم مباشرة
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-teal-900 mb-1">بيانات المسؤول</legend>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>اسمك الكامل</label>
                  <input required value={form.name} onChange={set("name")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>رقم الهاتف</label>
                  <input type="tel" required value={form.phone} onChange={set("phone")} className={inputCls} dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>البريد الإلكتروني</label>
                  <input type="email" required value={form.email} onChange={set("email")} className={inputCls} dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>كلمة المرور</label>
                  <input type="password" required minLength={6} value={form.password} onChange={set("password")} className={inputCls} />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4 pt-2 border-t border-line">
              <legend className="text-sm font-semibold text-teal-900 mb-1 pt-4">بيانات المنشأة الطبية</legend>
              <div>
                <label className={labelCls}>اسم العيادة / المستشفى</label>
                <input required value={form.facilityName} onChange={set("facilityName")} className={inputCls} placeholder="مثال: عيادة النيل التخصصية" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>نوع المنشأة</label>
                  <select value={form.facilityType} onChange={set("facilityType")} className={inputCls}>
                    {FACILITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>التخصص الرئيسي</label>
                  <select value={form.specialty} onChange={set("specialty")} className={inputCls}>
                    {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>المدينة</label>
                  <select value={form.city} onChange={set("city")} className={inputCls}>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>العنوان التفصيلي</label>
                  <input value={form.address} onChange={set("address")} className={inputCls} placeholder="الحي، الشارع" />
                </div>
              </div>
              <div>
                <label className={labelCls}>مواعيد العمل</label>
                <input value={form.workingHours} onChange={set("workingHours")} className={inputCls} placeholder="مثال: السبت–الخميس، 9 ص – 9 م" />
              </div>
              <div>
                <label className={labelCls}>نبذة عن المنشأة (اختياري)</label>
                <textarea rows={3} value={form.description} onChange={set("description")} className={`${inputCls} resize-none`} placeholder="الخدمات المقدمة، الكادر الطبي..." />
              </div>
            </fieldset>

            {error && (
              <p className="text-sm text-danger bg-danger-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-900 text-white font-semibold hover:bg-teal-800 transition-colors disabled:opacity-60"
            >
              {loading ? "جارٍ إنشاء الحساب…" : "إنشاء حساب المنشأة"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink/60 mt-6">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-teal-800 font-semibold">سجّل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
