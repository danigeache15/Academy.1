import { useMemo } from "react";
import { buildPanorama, PANORAMA_W, W, H, GROUND } from "../components/skylines";

const LABELS = { london: "LONDON", newyork: "NEW YORK", paris: "PARIS", tokyo: "TOKYO" };

function Bubble({ text, x, y, delay }) {
  const w = text.length * 8.6 + 30;
  return (
    <g transform={`translate(${x - 14} ${y})`}>
      <g className="world-bubble" style={{ animationDelay: `${delay}s` }}>
        <path d={`M0 0 H${w} a10 10 0 0 1 10 10 V30 a10 10 0 0 1 -10 10 H34 L18 54 L20 40 H0 a10 10 0 0 1 -10 -10 V10 a10 10 0 0 1 10 -10 Z`}
          fill="var(--white)" stroke="var(--ink)" strokeWidth="2" />
        <text x={w / 2} y="26" textAnchor="middle" style={{ font: "700 15px var(--font-body)", fill: "var(--ink)" }}>{text}</text>
      </g>
    </g>
  );
}

// One full pass of the four cities; drawn twice so the pan can loop.
function Panorama({ data, greetings }) {
  return (
    <>
      {data.cities.map((c, i) => c.far && (
        <g key={c.name} transform={`translate(${i * W} 0)`}>
          <path d={c.far} fill="#1B5876" />
          {c.snow && <path d={c.snow} fill="var(--navy-100)" opacity=".6" />}
        </g>
      ))}
      <path d={data.hills} fill="#154D6A" />
      {data.cities.map((c, i) => <path key={c.name} d={c.mid} fill="#0B3B56" transform={`translate(${i * W} 0)`} />)}
      <rect x="0" y={GROUND} width={PANORAMA_W} height={H - GROUND + 10} fill="var(--ink)" />
      {data.cities.map((c, i) => (
        <g key={c.name} transform={`translate(${i * W} 0)`}>
          <path d={c.front} fill="var(--ink)" />
          {c.strokes && <path d={c.strokes} fill="none" stroke="var(--ink)" strokeWidth="3" />}
          {c.windows.map((w, k) => (
            <rect key={k} className="world-window" x={w.x} y={w.y} width="3" height="4" fill="var(--lime)" style={{ animationDelay: `${w.d}s` }} />
          ))}
          {c.lights.map((l, k) => <circle key={k} className="world-lamp" cx={l.cx} cy={l.cy} r={l.r} fill="var(--lime)" />)}
          <text x={W / 2} y={GROUND + 34} textAnchor="middle" style={{ font: "600 13px var(--font-body)", letterSpacing: "0.4em", fill: "var(--navy-100)", opacity: 0.7 }}>
            {LABELS[c.name]}
          </text>
          <Bubble text={greetings[i]} x={c.anchor[0]} y={c.anchor[1]} delay={i * 0.6} />
        </g>
      ))}
    </>
  );
}

export default function World({ t }) {
  const data = useMemo(() => buildPanorama(), []);
  const w = t.world;
  return (
    <section id="world" className="world" style={{ position: "relative", overflow: "hidden", borderTop: "2px solid var(--ink)", color: "var(--white)" }}>
      <div className="world-stars" aria-hidden="true" />

      <div className="container reveal" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860 }}>
        <div className="chip" style={{ background: "transparent", color: "var(--white)", borderColor: "rgba(255,255,255,.5)", marginBottom: 22 }}>
          <span className="dot" />{w.eyebrow}
        </div>
        <h2 className="world-title">
          {w.title1} <em>{w.title2}</em>
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,.82)", maxWidth: 620, margin: "20px auto 0" }}>{w.sub}</p>
      </div>

      <div className="world-pano" role="img" aria-label={w.alt}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
          <g className="world-pan">
            {[0, 1].map((copy) => (
              <g key={copy} transform={`translate(${copy * PANORAMA_W} 0)`}>
                <Panorama data={data} greetings={w.greetings} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .world {
          padding-top: 110px;
          background: linear-gradient(180deg, #0E4F6B 0%, #0A3A52 62%, #0A3A52 100%);
        }
        .world-stars {
          position: absolute; inset: 0 0 30% 0; opacity: .85; pointer-events: none;
          background-image:
            radial-gradient(1.4px 1.4px at 12% 22%, var(--lime-100), transparent),
            radial-gradient(1px 1px at 28% 68%, var(--navy-100), transparent),
            radial-gradient(1.6px 1.6px at 44% 14%, var(--lime-100), transparent),
            radial-gradient(1px 1px at 61% 82%, var(--navy-100), transparent),
            radial-gradient(1.3px 1.3px at 77% 30%, var(--lime-100), transparent),
            radial-gradient(1px 1px at 88% 64%, var(--navy-100), transparent),
            radial-gradient(1.2px 1.2px at 6% 86%, var(--navy-100), transparent),
            radial-gradient(1.5px 1.5px at 94% 10%, var(--lime-100), transparent);
          background-size: 380px 260px;
          animation: worldTwinkle 6s ease-in-out infinite;
        }
        .world-title {
          font-family: var(--font-serif); font-weight: 400; font-variation-settings: "opsz" 144, "SOFT" 60;
          font-size: clamp(38px, 5.4vw, 72px); line-height: 1.04; letter-spacing: -0.025em; margin: 0;
        }
        .world-title em { font-style: italic; color: var(--lime); }
        .world-pano { position: relative; height: clamp(260px, 26vw, 400px); margin-top: 24px; }
        .world-pano svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .world-pan { animation: worldPan 90s linear infinite; }
        .world:hover .world-pan { animation-play-state: paused; }
        .world-bubble { transform-box: fill-box; transform-origin: 20% 100%; animation: worldBob 4s ease-in-out infinite; }
        .world-window { animation: worldWindow 9s steps(1) infinite; }
        .world-lamp { animation: worldTwinkle 3s ease-in-out infinite; }
        @keyframes worldPan { to { transform: translateX(-${PANORAMA_W}px); } }
        @keyframes worldBob { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-6px) rotate(1deg); } }
        @keyframes worldWindow { 0%, 70% { opacity: .9; } 71%, 86% { opacity: .15; } 87%, 100% { opacity: .9; } }
        @keyframes worldTwinkle { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
        @media (max-width: 760px) { .world { padding-top: 72px; } }
        @media (prefers-reduced-motion: reduce) {
          .world-pan, .world-bubble, .world-window, .world-lamp, .world-stars { animation: none; }
        }
      ` }} />
    </section>
  );
}
