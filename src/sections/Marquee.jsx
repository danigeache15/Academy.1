export default function Marquee({ t }) {
  const items = t.marquee;
  const row = (
    <span>
      {items.map((it, i) => (
        <span key={i}>
          <span>{it}</span>
          <span className="dot-sep" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="divider-strip" style={{ background: "var(--lime)" }}>
      <div className="marquee-track">
        {row}{row}
      </div>
    </div>
  );
}
