import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const ERROR_MAP = {
  "auth/email-already-in-use": "هذا البريد الإلكتروني مستخدم بالفعل.",
  "auth/invalid-email": "صيغة البريد الإلكتروني غير صحيحة.",
  "auth/weak-password": "كلمة المرور ضعيفة، استخدم 6 أحرف على الأقل.",
};

export default function RegisterPatient() {
  const { registerPatient } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
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
      await registerPatient(form);
      navigate("/dashboard/patient", { replace: true });
    } catch (err) {
      setError(ERROR_MAP[err.code] || "تعذر إنشاء الحساب، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-white border border-line rounded-2xl shadow-card p-7 sm:p-8">
          <h1 className="font-display font-extrabold text-2xl text-ink text-center">
            حساب مريض جديد
          </h1>
          <p className="text-sm text-ink/55 text-center mt-1.5">
            ابحث واحجز وتواصل مع العيادات بسهولة
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink/70 block mb-1.5">الاسم الكامل</label>
              <input
                required value={form.name} onChange={set("name")}
                className="w-full px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                placeholder="مثال: محمد أحمد"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70 block mb-1.5">البريد الإلكتروني</label>
              <input
                type="email" required value={form.email} onChange={set("email")}
                className="w-full px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                placeholder="example@email.com" dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70 block mb-1.5">رقم الهاتف</label>
              <input
                type="tel" required value={form.phone} onChange={set("phone")}
                className="w-full px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                placeholder="09xxxxxxxx" dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70 block mb-1.5">كلمة المرور</label>
              <input
                type="password" required minLength={6} value={form.password} onChange={set("password")}
                className="w-full px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                placeholder="6 أحرف على الأقل"
              />
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-900 text-white font-semibold hover:bg-teal-800 transition-colors disabled:opacity-60"
            >
              {loading ? "جارٍ إنشاء الحساب…" : "إنشاء الحساب"}
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
