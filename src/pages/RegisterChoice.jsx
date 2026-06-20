import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const OPTIONS = [
  {
    to: "/register/patient",
    title: "أنا مريض",
    body: "أبحث عن عيادة أو مستشفى، وأرغب في حجز موعد والتواصل مباشرة.",
    icon: (
      <path d="M12 21s-7-5.36-7-11a7 7 0 1114 0c0 5.64-7 11-7 11z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    to: "/register/provider",
    title: "أمثّل عيادة أو مستشفى",
    body: "أريد استقبال حجوزات المرضى، وإدارة المواعيد، والرد على استفساراتهم.",
    icon: (
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 7h.01M15 7h.01" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export default function RegisterChoice() {
  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink text-center">
          أنشئ حسابك في سودان تك
        </h1>
        <p className="text-ink/55 text-center mt-2">اختر نوع الحساب المناسب لك</p>

        <div className="grid sm:grid-cols-2 gap-5 mt-8">
          {OPTIONS.map((o) => (
            <Link
              key={o.to}
              to={o.to}
              className="group bg-white border-2 border-line rounded-2xl p-6 hover:border-teal-800 hover:shadow-card transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 grid place-items-center text-teal-800 group-hover:bg-teal-900 group-hover:text-white transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {o.icon}
                </svg>
              </div>
              <h2 className="font-display font-bold text-lg text-ink mt-4">{o.title}</h2>
              <p className="text-sm text-ink/60 mt-2 leading-relaxed">{o.body}</p>
              <span className="text-sm font-semibold text-clay-700 mt-4 inline-block">
                التسجيل ←
              </span>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-ink/60 mt-8">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-teal-800 font-semibold">
            سجّل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
