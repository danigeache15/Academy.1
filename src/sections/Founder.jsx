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
              background: "var(--navy)",
              padding: 0,
              overflow: "hidden",
              aspectRatio: "1 / 1.1",
              display: "flex",
              flexDirection: "column",
              transform: "rotate(2deg)",
            }}>
              {/* Geometric portrait */}
              <div style={{ flex: 1, position: "relative", background: "var(--navy-800)" }}>
                <svg viewBox="0 0 200 220" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMax meet">
                  {/* Body */}
                  <path d="M40 220 Q40 160 100 150 Q160 160 160 220 Z" fill="var(--navy-600)" />
                  {/* Shirt / collar */}
                  <path d="M75 155 L100 175 L125 155 L115 145 L100 158 L85 145 Z" fill="var(--orange)" stroke="var(--ink)" strokeWidth="1" />
                  {/* Long hair (behind head) */}
                  <path d="M50 100 Q44 50 100 44 Q156 50 150 100 L156 175 Q130 160 100 160 Q70 160 44 175 Z" fill="#2A1A0A" />
                  {/* Head */}
                  <circle cx="100" cy="100" r="48" fill="#C8956C" stroke="var(--ink)" strokeWidth="1.5" />
                  {/* Fringe */}
                  <path d="M54 92 Q56 52 100 52 Q144 52 146 92 Q130 66 100 68 Q72 68 54 92 Z" fill="#2A1A0A" />
                  {/* Eyes */}
                  <ellipse cx="84" cy="100" rx="6" ry="7" fill="#1A0A00" />
                  <ellipse cx="116" cy="100" rx="6" ry="7" fill="#1A0A00" />
                  <circle cx="86" cy="98" r="2" fill="white" />
                  <circle cx="118" cy="98" r="2" fill="white" />
                  {/* Brows */}
                  <path d="M76 88 Q84 84 92 87" fill="none" stroke="#2A1A0A" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M108 87 Q116 84 124 88" fill="none" stroke="#2A1A0A" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Nose */}
                  <path d="M98 105 Q96 115 100 118 Q104 115 102 105" fill="none" stroke="#A0704A" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Smile */}
                  <path d="M88 128 Q100 138 112 128" fill="none" stroke="#7A4A2A" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

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
