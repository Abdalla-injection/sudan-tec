export default function PulseLine({ className = "", animate = true, color = "var(--color-clay-500)" }) {
  return (
    <svg
      viewBox="0 0 340 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 30 H70 L90 8 L112 52 L132 16 L148 30 H200 L216 14 L232 46 L248 30 H340"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "pulse-line" : ""}
      />
    </svg>
  );
}
