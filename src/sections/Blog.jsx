const colors = {
  orange: "var(--orange)",
  lime: "var(--lime)",
  navy: "var(--navy)",
  ink: "var(--ink)",
};

export default function Blog({ t }) {
  return (
    <section id="blog" className="section">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48, gap: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 640 }}>
            <div className="eyebrow text-orange" style={{ marginBottom: 16 }}>— {t.blog.eyebrow}</div>
            <h2 className="editorial" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: 0, lineHeight: 1.02 }}>
              {t.blog.title}
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-700)", marginTop: 16, maxWidth: 540 }}>
              {t.blog.sub}
            </p>
          </div>
          <button className="btn btn-ghost">{t.blog.all} →</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "repeat(2, auto)", gap: 16 }} className="blog-grid">
          <article className="card" style={{
            gridRow: "span 2",
            background: colors[t.blog.posts[0].color],
            color: t.blog.posts[0].color === "navy" || t.blog.posts[0].color === "ink" ? "var(--white)" : "var(--ink)",
            padding: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ aspectRatio: "16 / 10", borderBottom: "2px solid var(--ink)", position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.04)" }}>
              <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice">
                <path d="M40 200 Q60 130 140 120 Q220 110 260 60" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="40" cy="200" r="8" fill="var(--ink)" />
                <circle cx="260" cy="60" r="8" fill="var(--ink)" />
                <text x="280" y="150" fontFamily="Archivo Black, sans-serif" fontSize="80" fill="var(--ink)" opacity="0.18">A</text>
                <text x="320" y="200" fontFamily="Archivo Black, sans-serif" fontSize="60" fill="var(--ink)" opacity="0.18">a</text>
              </svg>
            </div>
            <div style={{ padding: 28, display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", border: "1.5px solid currentColor", borderRadius: 999 }}>
                  {t.blog.posts[0].tag}
                </span>
                <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", opacity: 0.7 }}>{t.blog.posts[0].read}</span>
              </div>
              <h3 className="editorial" style={{ fontSize: 28, margin: 0, lineHeight: 1.1 }}>
                {t.blog.posts[0].title}
              </h3>
              <span style={{ marginTop: "auto", paddingTop: 20, fontSize: 14, fontWeight: 700 }}>
                Read article →
              </span>
            </div>
          </article>

          {t.blog.posts.slice(1).map((p, i) => (
            <article key={i} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--white)" }}>
              <div style={{ height: 120, background: colors[p.color], borderBottom: "2px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span className="display" style={{ fontSize: 64, color: p.color === "navy" || p.color === "ink" ? "var(--white)" : "var(--ink)", opacity: 0.15, letterSpacing: "-0.04em" }}>
                  {String(i + 2).padStart(2, "0")}
                </span>
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", background: colors[p.color], color: p.color === "navy" || p.color === "ink" ? "var(--white)" : "var(--ink)", borderRadius: 999 }}>
                    {p.tag}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ink-500)" }}>{p.read}</span>
                </div>
                <h3 className="editorial" style={{ fontSize: 18, margin: 0, lineHeight: 1.2 }}>
                  {p.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: 1fr !important; }
          .blog-grid > article:first-child { grid-row: auto !important; }
        }
      ` }} />
    </section>
  );
}
