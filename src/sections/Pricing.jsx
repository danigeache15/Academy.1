export default function Pricing({ t }) {
  return (
    <section id="pricing" className="section" style={{ background: "var(--paper-2)", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
          <div className="eyebrow text-orange" style={{ marginBottom: 16 }}>— {t.pricing.eyebrow}</div>
          <h2 className="editorial" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: 0, lineHeight: 1.02 }}>
            {t.pricing.title}
          </h2>
          <p style={{ fontSize: 17, color: "var(--ink-700)", marginTop: 20 }}>{t.pricing.sub}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" }} className="pricing-grid">
          {t.pricing.plans.map((p, i) => {
            return (
              <div key={i} className="card" style={{
                background: p.highlight ? "var(--ink)" : "var(--white)",
                color: p.highlight ? "var(--white)" : "var(--ink)",
                border: "2px solid var(--ink)",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transform: p.highlight ? "scale(1.02)" : "scale(1)",
                boxShadow: p.highlight ? "var(--shadow-pop)" : "none",
              }}>
                {p.highlight && (
                  <div style={{ position: "absolute", top: -14, right: 20, background: "var(--orange)", color: "var(--white)", border: "2px solid var(--ink)", borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    ★ {p.tag}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6 }}>{p.tag}</span>
                  {p.status && (
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", border: "1.5px solid currentColor", borderRadius: 999, opacity: 0.7 }}>{p.status}</span>
                  )}
                </div>
                <h3 className="display" style={{ fontSize: 30, margin: 0, marginBottom: 20 }}>{p.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.8 }}>{t.pricing.currency}</span>
                  <span className="display" style={{ fontSize: 56, lineHeight: 1, color: p.highlight ? "var(--lime)" : "var(--orange)" }}>{p.price}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.7 }}>{p.unit}</span>
                </div>
                <div style={{ fontSize: 15, opacity: 0.8, flex: 1 }}>
                  {p.per}
                </div>
                <a href="#cta" className={p.highlight ? "btn btn-primary" : "btn btn-dark"} style={{ marginTop: 24, width: "100%", textDecoration: "none", opacity: p.status ? 0.5 : 1, pointerEvents: p.status ? "none" : "auto" }}>
                  {p.cta} →
                </a>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "var(--ink-700)" }}>
          🛡️ {t.pricing.guarantee}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-grid > div { transform: none !important; }
        }
      ` }} />
    </section>
  );
}
