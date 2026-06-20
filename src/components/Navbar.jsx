import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const linkBase =
  "px-3 py-2 rounded-lg text-sm font-medium transition-colors";

export default function Navbar() {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/");
  }

  const dashboardPath =
    profile?.role === "provider" ? "/dashboard/provider" : "/dashboard/patient";

  return (
    <header className="sticky top-0 z-40 bg-sand-50/90 backdrop-blur border-b border-line">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "text-teal-900 bg-teal-100" : "text-ink/70 hover:text-teal-900 hover:bg-teal-50"}`
            }
          >
            ابحث عن عيادة
          </NavLink>
          {currentUser && (
            <NavLink
              to={dashboardPath}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-teal-900 bg-teal-100" : "text-ink/70 hover:text-teal-900 hover:bg-teal-50"}`
              }
            >
              لوحتي
            </NavLink>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {!currentUser ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-teal-900 hover:bg-teal-50 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-teal-900 text-white hover:bg-teal-800 transition-colors shadow-soft"
              >
                إنشاء حساب
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-ink/60 ml-1">
                مرحباً، {profile?.name?.split(" ")[0] || "بك"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-clay-700 hover:bg-clay-100 transition-colors"
              >
                تسجيل الخروج
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden w-10 h-10 grid place-items-center rounded-lg hover:bg-teal-50"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-line bg-sand-50 px-4 py-3 flex flex-col gap-1">
          <Link to="/search" onClick={() => setOpen(false)} className={linkBase}>
            ابحث عن عيادة
          </Link>
          {currentUser ? (
            <>
              <Link to={dashboardPath} onClick={() => setOpen(false)} className={linkBase}>
                لوحتي
              </Link>
              <button onClick={handleLogout} className={`${linkBase} text-right text-clay-700`}>
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className={linkBase}>
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className={`${linkBase} bg-teal-900 text-white text-center`}
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
