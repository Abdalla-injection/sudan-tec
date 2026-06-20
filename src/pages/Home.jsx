import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PulseLine from "../components/PulseLine";
import { CITIES, SPECIALTIES } from "../constants";

const STEPS = [
  {
    n: "01",
    title: "ابحث",
    body: "اختر مدينتك والتخصص المطلوب، وتصفح العيادات والمستشفيات القريبة منك.",
  },
  {
    n: "02",
    title: "احجز",
    body: "اختر الموعد المناسب لك مباشرة من ملف العيادة، بلا اتصال هاتفي ولا انتظار.",
  },
  {
    n: "03",
    title: "تواصل",
    body: "تحدث مع العيادة قبل أو بعد الحجز عبر الدردشة المباشرة لأي استفسار.",
  },
];

export default function Home() {
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (specialty) params.set("specialty", specialty);
    navigate(`/search?${params.toString()}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-teal-950">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <p className="text-clay-500 font-semibold text-sm tracking-wide mb-4">
            رعاية صحية أقرب إليك
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white leading-[1.15] max-w-3xl">
            احجز عيادتك القادمة في
            <span className="text-clay-500"> أقل من دقيقة</span>
          </h1>
          <p className="text-teal-100/80 text-lg mt-5 max-w-xl leading-relaxed">
            منصة سودان تك تجمع لك أفضل العيادات والمستشفيات في السودان، مع حجز فوري
            ودردشة مباشرة مع الطاقم الطبي.
          </p>

          <PulseLine className="w-64 h-10 mt-8 opacity-90" />

          {/* Search card */}
          <form
            onSubmit={handleSearch}
            className="mt-8 bg-white rounded-2xl shadow-card p-3 sm:p-4 flex flex-col sm:flex-row gap-3 max-w-2xl"
          >
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-sand-100 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="">كل المدن</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-sand-100 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="">كل التخصصات</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-clay-500 text-white font-semibold text-sm hover:bg-clay-600 transition-colors whitespace-nowrap"
            >
              ابحث الآن
            </button>
          </form>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-clay-600 font-semibold text-sm">كيف تعمل سودان تك</p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-1">
              ثلاث خطوات بسيطة
            </h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white border border-line rounded-2xl p-6">
              <span className="font-display font-extrabold text-3xl text-teal-100">
                {s.n}
              </span>
              <h3 className="font-display font-bold text-lg text-ink mt-3">
                {s.title}
              </h3>
              <p className="text-sm text-ink/60 mt-2 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="bg-teal-50/60 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-clay-600 font-semibold text-sm">تصفح حسب التخصص</p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-1 mb-8">
            أكثر التخصصات طلباً
          </h2>
          <div className="flex flex-wrap gap-3">
            {SPECIALTIES.map((s) => (
              <Link
                key={s}
                to={`/search?specialty=${encodeURIComponent(s)}`}
                className="px-5 py-2.5 rounded-full bg-white border border-line text-sm font-medium text-ink/70 hover:border-teal-700 hover:text-teal-900 transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-teal-900 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="relative">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white max-w-md">
              تدير عيادة أو مستشفى؟
            </h2>
            <p className="text-teal-100/75 mt-3 max-w-md leading-relaxed">
              انضم إلى سودان تك لاستقبال حجوزات جديدة، وإدارة المواعيد، والتواصل مع
              مرضاك من مكان واحد — مجاناً.
            </p>
          </div>
          <Link
            to="/register/provider"
            className="shrink-0 px-7 py-3.5 rounded-xl bg-clay-500 text-white font-semibold hover:bg-clay-600 transition-colors"
          >
            سجّل منشأتك الطبية
          </Link>
        </div>
      </section>
    </div>
  );
}
