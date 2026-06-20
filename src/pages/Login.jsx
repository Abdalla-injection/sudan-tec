import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const ERROR_MAP = {
  "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "auth/invalid-email": "صيغة البريد الإلكتروني غير صحيحة.",
  "auth/user-not-found": "لا يوجد حساب بهذا البريد الإلكتروني.",
  "auth/wrong-password": "كلمة المرور غير صحيحة.",
  "auth/too-many-requests": "محاولات كثيرة، الرجاء المحاولة لاحقاً.",
};

export default function Login() {
  const { login, profile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      navigate(from || "/", { replace: true });
    } catch (err) {
      setError(ERROR_MAP[err.code] || "تعذر تسجيل الدخول، حاول مرة أخرى.");
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
            تسجيل الدخول
          </h1>
          <p className="text-sm text-ink/55 text-center mt-1.5">
            مرضى ومنشآت طبية، نفس مكان الدخول
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink/70 block mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70 block mb-1.5">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-sand-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-900 text-white font-semibold hover:bg-teal-800 transition-colors disabled:opacity-60"
            >
              {loading ? "جارٍ الدخول…" : "تسجيل الدخول"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink/60 mt-6">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="text-teal-800 font-semibold">
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
}
