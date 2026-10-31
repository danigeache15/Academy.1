import { useEffect } from "react";
import FloatingShapes from "../components/FloatingShapes";

const HERO_SHAPES = [
  { type: "speech", color: "lime", x: 0.9, y: 0.2, z: 0, scale: 0.72, rot: [0.15, -0.45, 0.08] },
  { type: "mic", color: "orange", x: 0.83, y: 0.68, z: -1, scale: 0.85, rot: [0.2, 0.3, -0.45] },
  { type: "chart", color: "navy", x: 0.98, y: 0.86, z: 1, scale: 0.6, rot: [0.25, -0.6, 0] },
  { type: "quote", color: "sky", x: 0.56, y: 0.13, z: -4, scale: 0.75, rot: [0.2, 0.4, 0], hideOnMobile: true },
  { type: "megaphone", color: "orange", x: 0.47, y: 0.9, z: -5, scale: 0.75, rot: [0.2, -0.5, 0.25], hideOnMobile: true },
];


export default function Hero({ t }) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [t]);

  return (
    <header id="top" className="hero" style={{ position: "relative", overflow: "hidden", paddingTop: 130, paddingBottom: 100 }}>
      <FloatingShapes shapes={HERO_SHAPES} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }} className="hero-grid">
          <div>
            <div className="chip reveal in" style={{ marginBottom: 24 }}>
              <span className="dot" style={{ background: "var(--lime)" }} />
              {t.hero.eyebrow}
            </div>

            <h1 className="display reveal in" style={{ fontSize: "clamp(48px, 7vw, 96px)", margin: 0, color: "var(--ink)" }}>
              {t.hero.title1}
              <br />
              <span style={{ color: "var(--navy)", fontFamily: "var(--font-editorial)", fontStyle: "italic", fontWeight: 700, textTransform: "none", letterSpacing: "-0.025em" }}>
                {t.hero.title2}
              </span>
              <br />
              <span style={{ position: "relative", display: "inline-block" }}>
                {t.hero.title3}
                <svg style={{ position: "absolute", left: 0, right: 0, bottom: -8, width: "100%", height: 18 }} viewBox="0 0 400 18" preserveAspectRatio="none">
                  <path d="M2 14 Q 100 2 200 8 T 398 6" stroke="var(--orange)" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="reveal in" style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-700)", maxWidth: 560, marginTop: 28 }}>
              {t.hero.sub}
            </p>

            <div className="reveal in" style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <a href="#test" className="btn btn-primary btn-lg">
                {t.hero.cta}
                <span aria-hidden>→</span>
              </a>
              <a href="#cta" className="btn btn-ghost btn-lg">
                {t.hero.cta2}
              </a>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 28, flexWrap: "wrap" }}>
              {[t.hero.tag1, t.hero.tag2, t.hero.tag3].map((tag, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, padding: "5px 10px", background: "var(--white)", border: "1.5px solid var(--ink)", borderRadius: 999 }}>
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", minHeight: 480 }}>
            <div className="card card-pop" style={{ background: "var(--paper-2)", padding: 24, position: "relative", zIndex: 3, transform: "rotate(-2deg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px dashed var(--line)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                </div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ink-500)" }}>live · 24:18</div>
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--orange), var(--orange-700))", flexShrink: 0, border: "2px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14 }}>D</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", marginBottom: 4 }}>{t.hero.coach}</div>
                  <div style={{ background: "var(--white)", border: "1.5px solid var(--ink)", borderRadius: "16px 16px 16px 4px", padding: "10px 14px", fontSize: 14, maxWidth: 240 }}>
                    {t.hero.bubble1}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 14 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", marginBottom: 4 }}>{t.hero.you}</div>
                  <div style={{ background: "var(--lime)", border: "1.5px solid var(--ink)", borderRadius: "16px 16px 4px 16px", padding: "10px 14px", fontSize: 14, maxWidth: 240 }}>
                    {t.hero.bubble2}
                  </div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--navy)", flexShrink: 0, border: "2px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14 }}>T</div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--orange), var(--orange-700))", flexShrink: 0, border: "2px solid var(--ink)" }} />
                <div style={{ background: "var(--white)", border: "1.5px solid var(--ink)", borderRadius: "16px", padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                  <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ink-300)" }} />
                  <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ink-300)", animationDelay: "0.2s" }} />
                  <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ink-300)", animationDelay: "0.4s" }} />
                  <span style={{ fontSize: 11, color: "var(--ink-500)", marginLeft: 6 }}>{t.hero.typing}</span>
                </div>
              </div>
            </div>

            <div style={{ position: "absolute", top: -20, right: -10, zIndex: 4, transform: "rotate(8deg)" }}>
              <div className="bg-orange" style={{ border: "2px solid var(--ink)", borderRadius: 999, padding: "10px 16px", boxShadow: "var(--shadow-pop)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--white)", animation: "pulse 1.5s ease-in-out infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.05em", color: "var(--white)" }}>LIVE NOW</span>
              </div>
            </div>

            <div style={{ position: "absolute", bottom: 20, left: -30, zIndex: 4, transform: "rotate(-6deg)" }}>
              <div className="bg-lime" style={{ border: "2px solid var(--ink)", borderRadius: 14, padding: "10px 14px", boxShadow: "var(--shadow-pop)" }}>
                <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "var(--font-display)", lineHeight: 1 }}>{t.hero.badgeTop}</div>
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{t.hero.badgeSub}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80, padding: "32px 0", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="stats-row">
          {[
            { n: t.hero.stat1n, l: t.hero.stat1l, c: "var(--orange)" },
            { n: t.hero.stat2n, l: t.hero.stat2l, c: "var(--lime)" },
            { n: t.hero.stat3n, l: t.hero.stat3l, c: "var(--navy)" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, borderRight: i < 2 ? "1px solid var(--line)" : "none", paddingRight: 24 }}>
              <span className="display" style={{ fontSize: "clamp(36px, 4vw, 56px)", color: s.c }}>{s.n}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-700)" }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } }
        @keyframes dotPulse { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
        .dot-pulse { animation: dotPulse 1.2s ease-in-out infinite; display: inline-block; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: 1fr !important; gap: 16px !important; }
          .stats-row > div { border-right: none !important; border-bottom: 1px solid var(--line); padding-bottom: 16px; }
        }
      ` }} />
    </header>
  );
}
