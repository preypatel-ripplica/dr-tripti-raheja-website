// Thin ring with text set on a circular path + a centered mark.
// A signature motif from the reference board (Salute's "#1 in Gynecology" disc).

export default function CircleBadge({
  text = "Compassionate care · 28+ years · ",
  center = "✳",
  size = 128,
  className,
}: {
  text?: string;
  center?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <defs>
        <path
          id="circlePath"
          d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
        />
      </defs>
      <circle cx="100" cy="100" r="98" fill="#fff" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <text
        fill="currentColor"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        <textPath href="#circlePath" startOffset="0%">
          {text.repeat(2)}
        </textPath>
      </text>
      <text
        x="100"
        y="100"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display)", fontSize: "34px" }}
      >
        {center}
      </text>
    </svg>
  );
}
