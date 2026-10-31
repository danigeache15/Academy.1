import BRAND from "../brand";

export default function Founder({ t }) {
  const f = t.founder;
  return (
    <section id="founder" className="section" style={{ background: "var(--paper)", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "center" }} className="founder-grid">

          {/* Avatar / illustration */}
          <div style={{ position: "relative" }}>
            <div className="card card-pop" style={{
              background: "var(--white)",
              padding: 0,
              overflow: "hidden",
              aspectRatio: "1 / 1.1",
              display: "flex",
              flexDirection: "column",
              transform: "rotate(2deg)",
            }}>
              {/* Left blank until the founder's photo is ready */}
              <div style={{ flex: 1, background: "var(--white)" }} />

              <div style={{ padding: "16px 20px", background: "var(--ink)", borderTop: "2px solid var(--white)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--white)", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
                  {f.name.toUpperCase()}
                </div>
                <div style={{ fontSize: 11, color: "var(--lime)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                  {f.card}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div style={{ position: "absolute", bottom: -16, right: -16, zIndex: 4, transform: "rotate(-4deg)" }}>
              <div style={{
                background: "var(--lime)",
                border: "2px solid var(--ink)",
                borderRadius: 12,
                padding: "10px 16px",
                boxShadow: "var(--shadow-pop)",
              }}>
                <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "var(--font-display)", lineHeight: 1 }}>🎤</div>
                <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, letterSpacing: "0.05em" }}>{f.badge}</div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="eyebrow text-orange" style={{ marginBottom: 16 }}>— {f.eyebrow}</div>
            <h2 className="editorial" style={{ fontSize: "clamp(32px, 4vw, 52px)", margin: 0, lineHeight: 1.05 }}>
              {f.title}
            </h2>

            <div style={{ margin: "32px 0", padding: "24px 28px", background: "var(--paper-2)", border: "2px solid var(--ink)", borderRadius: "var(--radius-lg)", borderLeft: "6px solid var(--orange)" }}>
              <h3 className="editorial" style={{ fontSize: 26, margin: 0, color: "var(--ink)" }}>{f.name}</h3>
              <div style={{ fontSize: 13, color: "var(--ink-500)", fontFamily: "var(--font-mono)", marginTop: 4 }}>{f.role}</div>
            </div>

            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-700)", margin: 0 }}>{f.bio1}</p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-700)", marginTop: 16 }}>{f.bio2}</p>

            {BRAND.linkedin && <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={BRAND.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark"
                style={{ gap: 10 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                {f.linkedin}
              </a>
            </div>}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .founder-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      ` }} />
    </section>
  );
}
