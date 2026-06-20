import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-sand-100 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <Logo />
          <p className="text-sm text-ink/60 mt-3 max-w-sm leading-relaxed">
            سودان تك تربط المرضى بالعيادات والمستشفيات في السودان: بحث، حجز مواعيد،
            ودردشة مباشرة في مكان واحد.
          </p>
        </div>
        <div className="text-sm text-ink/50">
          © {new Date().getFullYear()} سودان تك. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
