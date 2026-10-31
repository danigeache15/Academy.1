"use client";

import { useEffect, useMemo, useRef } from "react";
import { buildScene, W, H, GROUND } from "./skylines";

const LABELS = { london: "London", newyork: "New York", paris: "Paris", tokyo: "Tokyo" };

// The small moving thing each night sky gets.
function Detail({ scene }) {
  if (scene === "london") return (
    <g className="pb-fly">
      <path d="M0 0 L26 8 L0 15 L7 8 Z" fill="var(--paper)" />
      <path d="M7 8 L26 8" stroke="var(--ink-300)" strokeWidth=".8" />
    </g>
  );
  if (scene === "newyork") return (
    <g className="pb-shoot">
      <line x1="0" y1="0" x2="-90" y2="-34" stroke="url(#pb-trail)" strokeWidth="2" strokeLinecap="round" />
      <circle r="2.2" fill="var(--lime-100)" />
    </g>
  );
  if (scene === "paris") return (
    <g className="pb-balloon">
      <path d="M0 0 C-22 0 -26 -30 0 -48 C26 -30 22 0 0 0 Z" fill="var(--orange)" />
      <path d="M0 0 C-8 0 -10 -30 0 -48 C10 -30 8 0 0 0 Z" fill="var(--lime)" />
      <path d="M-5 2 L-4 10 M5 2 L4 10" stroke="var(--paper)" strokeWidth=".8" />
      <rect x="-5" y="10" width="10" height="7" rx="1" fill="var(--paper)" />
    </g>
  );
  return (
    <g className="pb-birds">
      {[[0, 0], [26, 10], [-18, 14], [48, -6]].map(([x, y], i) => (
        <path key={i} className="pb-wing" style={{ animationDelay: `${i * 0.17}s` }} transform={`translate(${x} ${y})`}
          d="M-9 0 Q-4 -5 0 0 Q4 -5 9 0" fill="none" stroke="var(--paper)" strokeWidth="1.6" strokeLinecap="round" />
      ))}
    </g>
  );
}

// `from` is the background colour of the section above, so the sky can fade out of it.
export default function Landscape({ scene, from = "var(--white)" }) {
  const s = useMemo(() => buildScene(scene), [scene]);
  const ref = useRef(null);

  // Gentle depth: far layers drift less than near ones as the strip crosses the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty("--p", Math.max(-1, Math.min(1, p)).toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="pb-land" ref={ref} style={{ "--pb-from": from }} role="img" aria-label={`Night skyline of ${LABELS[scene]}`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id={`pb-sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--pb-from)" }} />
            <stop offset=".22" stopColor="#0E4864" />
            <stop offset=".75" stopColor="var(--navy-900)" />
          </linearGradient>
          <linearGradient id="pb-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--lime-100)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--lime-100)" />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill={`url(#pb-sky-${scene})`} />
        <g className="pb-layer-stars">
          {s.stars.map((st, i) => (
            <circle key={i} className="pb-star" cx={st.x} cy={st.y} r={st.r}
              fill={st.warm ? "var(--lime-100)" : "var(--navy-100)"} style={{ animationDelay: `${st.d}s` }} />
          ))}
        </g>
        <Detail scene={scene} />

        <g className="pb-layer-far">
          <path d={s.far} fill="#164A66" />
          {s.snow && <path d={s.snow} fill="var(--navy-100)" opacity=".55" />}
        </g>
        <g className="pb-layer-mid"><path d={s.mid} fill="#0B3349" /></g>
        <g className="pb-layer-front">
          <path d={s.front} fill="#05182A" />
          {s.strokes && <path d={s.strokes} fill="none" stroke="#05182A" strokeWidth="3" />}
          {s.windows.map((w, i) => (
            <rect key={i} className="pb-window" x={w.x} y={w.y} width="3" height="4" fill="var(--lime)" style={{ animationDelay: `${w.d}s` }} />
          ))}
          {s.lights.map((l, i) => <circle key={i} className="pb-lamp" cx={l.cx} cy={l.cy} r={l.r} fill="var(--lime)" />)}
          <rect x="-10" y={GROUND} width={W + 20} height={H - GROUND + 40} fill="#05182A" />
        </g>
      </svg>
    </div>
  );
}
