export default function Methodology({ t }) {
  return (
    <section id="method" className="section" style={{ background: "var(--paper-2)", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }} className="method-grid">
          <div style={{ position: "sticky", top: 120 }}>
            <div className="eyebrow text-orange" style={{ marginBottom: 16 }}>— {t.method.eyebrow}</div>
            <h2 className="editorial" style={{ fontSize: "clamp(36px, 4.5vw, 56px)", margin: 0, color: "var(--ink)" }}>
              {t.method.title}
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-700)", marginTop: 20, lineHeight: 1.6 }}>
              {t.method.sub}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {t.method.steps.map((step, i) => {
              const colors = ["var(--orange)", "var(--lime)", "var(--navy)", "var(--ink)"];
              const txt = i === 2 || i === 3 ? "var(--white)" : "var(--ink)";
              return (
                <div key={i} className="card" style={{
                  background: colors[i],
                  color: txt,
                  border: "2px solid var(--ink)",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 24,
                  alignItems: "start",
                  transform: i % 2 === 0 ? "translateX(0)" : "translateX(24px)",
                }}>
                  <div className="display" style={{ fontSize: 56, lineHeight: 1, color: txt, opacity: 0.9 }}>
                    {step.n}
                  </div>
                  <div>
                    <h3 className="editorial" style={{ fontSize: 26, margin: 0, color: txt }}>{step.t}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.55, marginTop: 10, color: txt, opacity: 0.92 }}>
                      {step.d}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .method-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .method-grid > div:first-child { position: static !important; }
        }
      ` }} />
    </section>
  );
}
