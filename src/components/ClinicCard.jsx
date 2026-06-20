import { Link } from "react-router-dom";

const typeLabel = { clinic: "عيادة خاصة", hospital: "مستشفى" };

export default function ClinicCard({ clinic }) {
  return (
    <Link
      to={`/clinic/${clinic.id}`}
      className="group block bg-white rounded-2xl border border-line p-5 hover:shadow-card hover:border-teal-200 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-teal-50 grid place-items-center text-teal-800 font-display font-bold text-lg">
            {clinic.name?.charAt(0) || "ه"}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-ink truncate group-hover:text-teal-900">
              {clinic.name}
            </h3>
            <p className="text-sm text-ink/55 mt-0.5">
              {typeLabel[clinic.type] || clinic.type} · {clinic.specialty}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800">
          {clinic.city}
        </span>
      </div>

      {clinic.description && (
        <p className="text-sm text-ink/60 mt-3 line-clamp-2 leading-relaxed">
          {clinic.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
        <div className="flex items-center gap-1 text-sm text-ink/60">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-5.36-7-11a7 7 0 1114 0c0 5.64-7 11-7 11z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {clinic.address || clinic.city}
        </div>
        <span className="text-sm font-semibold text-clay-700 group-hover:text-clay-600">
          عرض الملف واحجز ←
        </span>
      </div>
    </Link>
  );
}
