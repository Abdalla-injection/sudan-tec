import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 text-center">
      <div>
        <p className="font-display font-extrabold text-6xl text-teal-100">404</p>
        <h1 className="font-display font-bold text-2xl text-ink mt-2">الصفحة غير موجودة</h1>
        <Link to="/" className="text-teal-800 font-semibold mt-4 inline-block">
          العودة إلى الرئيسية ←
        </Link>
      </div>
    </div>
  );
}
