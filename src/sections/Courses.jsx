import { useState } from "react";
import FloatingShapes from "../components/FloatingShapes";

const LEVEL_SHAPES = [
  { type: "podium", color: "lime", x: 0.95, y: 0.12, z: -1, scale: 0.55, rot: [0.3, -0.6, 0], hideOnMobile: true },
];

function colorOf(c) {
  return c === "lime" ? "var(--lime)" : c === "orange" ? "var(--orange)" : c === "navy" ? "var(--navy)" : "var(--ink)";
}
function textOn(c) {
  return c === "navy" || c === "ink" ? "var(--white)" : "var(--ink)";
}

function CoursesCards({ t }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="courses-cards">
      {t.courses.list.map((c, i) => (
        <div key={i} className="card" style={{
          background: colorOf(c.color),
          color: textOn(c.color),
          border: "2px solid var(--ink)",
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 280,
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "2px solid var(--ink)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="display" style={{ fontSize: 40, lineHeight: 1 }}>{c.code}</span>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)", padding: "4px 10px", border: "1.5px solid currentColor", borderRadius: 999 }}>
              {c.weeks}
            </span>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
            <h3 className="editorial" style={{ fontSize: 24, margin: 0, marginBottom: 10 }}>{c.name}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.92, flex: 1 }}>{c.desc}</p>
            <button style={{ marginTop: 16, alignSelf: "flex-start", background: "transparent", border: 0, color: "currentColor", fontWeight: 700, fontSize: 14, padding: 0, borderBottom: "2px solid currentColor", cursor: "pointer" }}>
              {t.courses.cta} →
            </button>
          </div>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) { .courses-cards { grid-template-columns: 1fr !important; } }
        @media (min-width: 901px) and (max-width: 1100px) { .courses-cards { grid-template-columns: repeat(2, 1fr) !important; } }
      ` }} />
    </div>
  );
}

function CoursesTable({ t }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--ink)", color: "var(--white)" }}>
            {t.courses.tableHeads.map((h, i) => (
              <th key={i} style={{ textAlign: "left", padding: "16px 20px", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 13, letterSpacing: "0.05em" }}>
                {h}
              </th>
            ))}
            <th style={{ padding: "16px 20px" }}></th>
          </tr>
        </thead>
        <tbody>
          {t.courses.list.map((c, i) => (
            <tr key={i} style={{ borderBottom: i < t.courses.list.length - 1 ? "1px solid var(--line)" : "none" }} className="course-row">
              <td style={{ padding: "20px", verticalAlign: "middle", width: 100 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 12, background: colorOf(c.color), color: textOn(c.color), border: "2px solid var(--ink)", fontFamily: "var(--font-display)", fontSize: 22 }}>
                  {c.code}
                </span>
              </td>
              <td style={{ padding: "20px", verticalAlign: "middle" }}>
                <div className="editorial" style={{ fontSize: 20 }}>{c.name}</div>
              </td>
              <td style={{ padding: "20px", verticalAlign: "middle", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-500)" }}>{c.weeks}</td>
              <td style={{ padding: "20px", verticalAlign: "middle", fontSize: 14, color: "var(--ink-700)", maxWidth: 400 }}>{c.desc}</td>
              <td style={{ padding: "20px", textAlign: "right" }}>
                <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }}>→</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style dangerouslySetInnerHTML={{ __html: `.course-row:hover { background: var(--paper-2); }` }} />
    </div>
  );
}

function CoursesCarousel({ t }) {
  const [idx, setIdx] = useState(0);
  const list = t.courses.list;
  const next = () => setIdx((i) => (i + 1) % list.length);
  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);
  const c = list[idx];

  return (
    <div>
      <div className="card" style={{
        background: colorOf(c.color),
        color: textOn(c.color),
        border: "2px solid var(--ink)",
        padding: 0,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        minHeight: 360,
      }}>
        <div style={{ padding: 40, borderRight: "2px solid var(--ink)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="display" style={{ fontSize: "clamp(80px, 12vw, 160px)", lineHeight: 0.85 }}>{c.code}</div>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)", padding: "5px 12px", border: "1.5px solid currentColor", borderRadius: 999, display: "inline-block" }}>
            {c.weeks}
          </span>
        </div>
        <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3 className="editorial" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", margin: 0, marginBottom: 16 }}>{c.name}</h3>
          <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.95, maxWidth: 480 }}>{c.desc}</p>
          <button style={{ marginTop: 24, alignSelf: "flex-start", background: "var(--white)", color: "var(--ink)", border: "2px solid var(--ink)", padding: "12px 20px", borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            {t.courses.cta} →
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {list.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to ${i + 1}`} style={{
              width: i === idx ? 32 : 12, height: 12, borderRadius: 999,
              background: i === idx ? "var(--ink)" : "var(--ink-300)",
              border: 0, padding: 0, transition: "all .25s ease", cursor: "pointer",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={prev} className="btn btn-ghost" style={{ width: 48, height: 48, padding: 0, borderRadius: "50%" }} aria-label="Previous">←</button>
          <button onClick={next} className="btn btn-dark" style={{ width: 48, height: 48, padding: 0, borderRadius: "50%" }} aria-label="Next">→</button>
        </div>
      </div>
    </div>
  );
}

export default function Courses({ t, layout = "cards" }) {
  return (
    <section id="courses" className="section">
      <FloatingShapes shapes={LEVEL_SHAPES} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48, gap: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow text-orange" style={{ marginBottom: 16 }}>— {t.courses.eyebrow}</div>
            <h2 className="editorial" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0, lineHeight: 1.02 }}>
              {t.courses.title}<br />
              <span style={{ color: "var(--orange)", fontStyle: "italic" }}>{t.courses.title2}</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-700)", marginTop: 20, maxWidth: 560 }}>
              {t.courses.sub}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["cards", "table", "carousel"].map((l) => (
              <button key={l} style={{
                padding: "8px 14px", fontSize: 12, fontWeight: 700,
                background: layout === l ? "var(--ink)" : "var(--white)",
                color: layout === l ? "var(--white)" : "var(--ink)",
                border: "2px solid var(--ink)", borderRadius: 999, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>
        </div>

        {layout === "cards" && <CoursesCards t={t} />}
        {layout === "table" && <CoursesTable t={t} />}
        {layout === "carousel" && <CoursesCarousel t={t} />}
      </div>
    </section>
  );
}
