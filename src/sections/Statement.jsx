import { useEffect, useRef } from "react";

// The academy's promise, lighting up word by word as it scrolls past.
export default function Statement({ t }) {
  const ref = useRef(null);
  const words = t.statement.text.split(" ");

  useEffect(() => {
    const el = ref.current;
    const spans = el.querySelectorAll("span");
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.35), 0), 1);
      const lit = p * spans.length;
      spans.forEach((s, i) => s.style.setProperty("--lit", Math.min(Math.max(lit - i, 0), 1)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [t]);

  return (
    <section className="section statement" style={{ background: "var(--white)", padding: "150px 0" }}>
      <div className="container">
        <p className="statement-text" ref={ref}>
          {words.map((w, i) => <span key={i} className={t.statement.accents.includes(w) ? "accent" : ""}>{w} </span>)}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .statement-text {
          font-family: var(--font-serif); font-weight: 400; font-variation-settings: "opsz" 144, "SOFT" 60;
          font-size: clamp(32px, 4.6vw, 66px); line-height: 1.12; letter-spacing: -0.015em;
          margin: 0; max-width: 22ch;
        }
        .statement-text span { color: color-mix(in srgb, var(--ink) calc(16% + var(--lit, 0) * 84%), transparent); transition: color .2s linear; }
        .statement-text span.accent { font-style: italic; color: color-mix(in srgb, var(--orange-700) calc(16% + var(--lit, 0) * 84%), transparent); }
        @media (max-width: 760px) { .statement { padding: 96px 0 !important; } }
      ` }} />
    </section>
  );
}
