import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 group ${className}`}>
      <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-teal-900 text-sand-50 overflow-hidden">
        <svg viewBox="0 0 32 32" className="w-5 h-5">
          <path
            d="M3 17h5l2.5-7 4 14 3-10 2 3h9.5"
            fill="none"
            stroke="var(--color-clay-500)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display font-extrabold text-lg sm:text-xl text-teal-950 tracking-tight whitespace-nowrap">
        سودان<span className="text-clay-600"> تك</span>
      </span>
    </Link>
  );
}
