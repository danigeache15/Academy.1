export default function Teachers({ t }) {
  const accents = ["var(--orange)", "var(--lime)", "var(--navy)", "var(--orange)", "var(--lime)"];
  return (
    <section id="teachers" className="section" style={{ background: "var(--ink)", color: "var(--white)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48, gap: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 600 }}>
            <div className="eyebrow" style={{ color: "var(--lime)", marginBottom: 16 }}>— {t.teachers.eyebrow}</div>
            <h2 className="editorial" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0, color: "var(--white)" }}>
              {t.teachers.title}
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", marginTop: 20, maxWidth: 520 }}>
              {t.teachers.sub}
            </p>
          </div>
          <a href="#founder" className="btn btn-ghost" style={{ borderColor: "var(--white)", color: "var(--white)", textDecoration: "none" }}>
            {t.teachers.meet} →
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }} className="teachers-grid">
          {t.teachers.list.map((p, i) => (
            <div key={i} style={{
              background: "var(--paper)",
              color: "var(--ink)",
              border: "2px solid var(--white)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transform: i % 2 === 0 ? "translateY(0)" : "translateY(20px)",
            }}>
              <div style={{ aspectRatio: "1 / 0.8", background: accents[i], color: accents[i] === "var(--navy)" ? "var(--white)" : "var(--ink)", position: "relative", borderBottom: "2px solid var(--ink)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="display" style={{ fontSize: 72, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <div style={{ position: "absolute", bottom: 10, left: 10, background: "var(--ink)", color: "var(--white)", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, padding: "4px 8px", borderRadius: 999 }}>
                  {p.tag}
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <h3 className="editorial" style={{ fontSize: 19, margin: 0 }}>{p.name}</h3>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-700)", marginTop: 8 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) { .teachers-grid { grid-template-columns: repeat(2, 1fr) !important; } .teachers-grid > div { transform: none !important; } }
        @media (max-width: 520px) { .teachers-grid { grid-template-columns: 1fr !important; } }
      ` }} />
    </section>
  );
}
