import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { CITIES, SPECIALTIES } from "../constants";
import ClinicCard from "../components/ClinicCard";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const city = params.get("city") || "";
  const specialty = params.get("specialty") || "";
  const type = params.get("type") || "";
  const q = params.get("q") || "";

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDocs(collection(db, "clinics"))
      .then((snap) => {
        if (!active) return;
        setClinics(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch((e) => {
        console.error(e);
        if (active) setError("تعذر تحميل العيادات. تأكد من اتصالك بالإنترنت.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  const filtered = useMemo(() => {
    return clinics.filter((c) => {
      if (city && c.city !== city) return false;
      if (specialty && c.specialty !== specialty) return false;
      if (type && c.type !== type) return false;
      if (q) {
        const hay = `${c.name} ${c.description || ""} ${c.address || ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [clinics, city, specialty, type, q]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-extrabold text-3xl text-ink">
        ابحث عن عيادة أو مستشفى
      </h1>
      <p className="text-ink/55 mt-2">
        {loading ? "جارٍ التحميل…" : `${filtered.length} نتيجة متاحة`}
      </p>

      <div className="mt-6 grid sm:grid-cols-4 gap-3">
        <input
          value={q}
          onChange={(e) => update("q", e.target.value)}
          placeholder="ابحث بالاسم..."
          className="px-4 py-2.5 rounded-xl bg-white border border-line text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
        />
        <select
          value={city}
          onChange={(e) => update("city", e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-line text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
        >
          <option value="">كل المدن</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={specialty}
          onChange={(e) => update("specialty", e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-line text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
        >
          <option value="">كل التخصصات</option>
          {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={type}
          onChange={(e) => update("type", e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-line text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
        >
          <option value="">عيادة ومستشفى</option>
          <option value="clinic">عيادة خاصة</option>
          <option value="hospital">مستشفى</option>
        </select>
      </div>

      <div className="mt-8">
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-white border border-line animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-danger">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-line rounded-2xl">
            <p className="font-display font-bold text-lg text-ink">لا توجد نتائج مطابقة</p>
            <p className="text-ink/55 mt-2">جرّب توسيع نطاق البحث أو تغيير الفلاتر.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <ClinicCard key={c.id} clinic={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
