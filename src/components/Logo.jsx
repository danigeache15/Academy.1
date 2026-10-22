import BRAND from "../brand";

export function LogoMark({ size = 56 }) {
  return (
    <svg
      width={size}
      height={size * (60 / 80)}
      viewBox="0 0 80 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <g transform="rotate(-8 22 30)">
        <path
          d="M6 8 Q6 4 10 4 L36 4 Q40 4 40 8 L40 38 Q40 42 36 42 L20 42 L14 50 L14 42 L10 42 Q6 42 6 38 Z"
          fill="var(--lime)"
          stroke="var(--ink)"
          strokeWidth="1.2"
        />
      </g>
      <g transform="rotate(8 58 30)">
        <path
          d="M44 8 Q44 4 48 4 L74 4 Q78 4 78 8 L78 38 Q78 42 74 42 L60 42 L54 50 L54 42 L48 42 Q44 42 44 38 Z"
          fill="var(--orange)"
          stroke="var(--ink)"
          strokeWidth="1.2"
        />
      </g>
      <path
        d="M22 4 Q22 0 26 0 L54 0 Q58 0 58 4 L58 36 Q58 40 54 40 L42 40 L36 50 L36 40 L26 40 Q22 40 22 36 Z"
        fill="var(--navy)"
        stroke="var(--paper)"
        strokeWidth="1.2"
      />
      <circle cx="32" cy="20" r="2.2" fill="var(--paper)" />
      <circle cx="40" cy="20" r="2.2" fill="var(--paper)" />
      <circle cx="48" cy="20" r="2.2" fill="var(--paper)" />
    </svg>
  );
}

export function LogoFull({ size = 44, mono = false }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <LogoMark size={size} />
      <div style={{ lineHeight: 0.95, display: "flex", flexDirection: "column" }}>
        <span
          className="display"
          style={{
            fontSize: size * 0.46,
            color: mono ? "currentColor" : "var(--ink)",
            letterSpacing: "-0.02em",
          }}
        >
          {BRAND.logo[0]}
        </span>
        <span
          className="editorial"
          style={{
            fontSize: size * 0.38,
            fontStyle: "italic",
            fontWeight: 700,
            color: mono ? "currentColor" : "var(--navy)",
            marginTop: -2,
          }}
        >
          {BRAND.logo[1]}
        </span>
        <span
          style={{
            fontSize: size * 0.18,
            fontWeight: 700,
            letterSpacing: "0.32em",
            color: mono ? "currentColor" : "var(--navy)",
            marginTop: 2,
          }}
        >
          {BRAND.logo[2]}
        </span>
      </div>
    </div>
  );
}
