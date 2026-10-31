"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BRAND from "../brand";
import MagicSky from "./MagicSky";
import { BOOK_TITLE, BookCtx, CHAPTERS } from "./chapters";

const TURN_MS = 1000;
// One page per view on phones; `pos` is always counted in single pages so both layouts agree.
const PAGES = CHAPTERS.flatMap((c, i) => [
  { chapter: c, index: i, side: "left", spec: c.left, folio: i * 2 },
  { chapter: c, index: i, side: "right", spec: c.right, folio: i * 2 + 1 },
]);

function Page({ page, className = "" }) {
  if (!page) return <div className={`vw-page ${className}`} />;
  const { chapter, side, spec, folio } = page;
  const cls = ["vw-page", side, spec.dark && "dark", spec.center && "center", className].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      {spec.bare && spec.dark ? spec.body() : (
        <div className="vw-page-inner">
          <div>{spec.body()}</div>
        </div>
      )}
      {!spec.bare && <div className="vw-runner">{side === "left" ? BOOK_TITLE : `${chapter.numeral} · ${chapter.title}`}</div>}
      {!spec.bare && <div className="vw-folio">— {folio} —</div>}
    </div>
  );
}

export default function Book() {
  const [pos, setPos] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [turning, setTurning] = useState(null);
  const [toc, setToc] = useState(false);
  const [quiz, setQuiz] = useState({ state: "idle", step: 0, answers: [], picked: null });
  const timer = useRef(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fromHash = () => {
      const i = CHAPTERS.findIndex((c) => c.id === window.location.hash.slice(1));
      if (i >= 0) setPos(i * 2);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => { mq.removeEventListener("change", sync); window.removeEventListener("hashchange", fromHash); clearTimeout(timer.current); };
  }, []);

  // A "unit" is a spread on desktop and a single page on mobile.
  const unit = mobile ? pos : Math.floor(pos / 2);
  const lastUnit = mobile ? PAGES.length - 1 : CHAPTERS.length - 1;
  const chapterIdx = Math.floor(pos / 2);

  useEffect(() => {
    const id = CHAPTERS[chapterIdx].id;
    window.history.replaceState(null, "", chapterIdx ? `#${id}` : window.location.pathname);
  }, [chapterIdx]);

  const turnTo = useCallback((to) => {
    if (turning || to === unit || to < 0 || to > lastUnit) return;
    const toPos = mobile ? to : to * 2;
    if (reduceMotion.current) { setPos(toPos); return; }
    setTurning({ from: unit, to, dir: to > unit ? 1 : -1, key: Date.now() });
    timer.current = setTimeout(() => { setPos(toPos); setTurning(null); }, TURN_MS);
  }, [turning, unit, lastUnit, mobile]);

  const goTo = useCallback((id) => {
    const i = CHAPTERS.findIndex((c) => c.id === id);
    if (i < 0) return;
    setToc(false);
    turnTo(mobile ? i * 2 : i);
  }, [turnTo, mobile]);

  useEffect(() => {
    const onKey = (e) => {
      if (toc) { if (e.key === "Escape") setToc(false); return; }
      if (e.key === "ArrowRight" || e.key === "PageDown") turnTo(unit + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") turnTo(unit - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turnTo, unit, toc]);

  const touch = useRef(null);
  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) turnTo(unit + (dx < 0 ? 1 : -1));
  };

  const ctx = useMemo(() => ({ goTo, quiz, setQuiz, inLeaf: false }), [goTo, quiz]);
  const leafCtx = useMemo(() => ({ ...ctx, inLeaf: true }), [ctx]);

  // What sits under the turning leaf, and what the leaf carries on each face.
  const spreadPages = (s) => [PAGES[s * 2], PAGES[s * 2 + 1]];
  let base, leaf = null;
  if (mobile) {
    if (!turning) base = [PAGES[pos]];
    else if (turning.dir > 0) { base = [PAGES[turning.to]]; leaf = { front: PAGES[turning.from], back: null }; }
    else { base = [PAGES[turning.from]]; leaf = { front: PAGES[turning.to], back: null }; }
  } else if (!turning) {
    base = spreadPages(unit);
  } else {
    const [fl, fr] = spreadPages(turning.from), [tl, tr] = spreadPages(turning.to);
    if (turning.dir > 0) { base = [fl, tr]; leaf = { front: fr, back: tl }; }
    else { base = [tl, fr]; leaf = { front: fl, back: tr }; }
  }

  const progress = pos / (PAGES.length - 1);
  const chapter = CHAPTERS[turning ? (mobile ? Math.floor(turning.to / 2) : turning.to) : chapterIdx];

  return (
    <BookCtx.Provider value={ctx}>
      <main className="vw" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <MagicSky pulse={turning?.key ?? 0} dir={turning?.dir ?? 1} />

        <header className="vw-top">
          <a className="vw-brand" href="#" onClick={(e) => { e.preventDefault(); goTo("cover"); }}>
            {BOOK_TITLE}<b>{BRAND.name.toUpperCase()}</b>
          </a>
          <button className="vw-ribbon" onClick={() => setToc(true)} aria-haspopup="dialog">Contents</button>
        </header>

        <div className="vw-stage">
          <div
            className="vw-book"
            style={{ "--turn-ms": `${TURN_MS}ms`, "--left-edge": `${2 + progress * 10}px`, "--right-edge": `${2 + (1 - progress) * 10}px` }}
          >
            {base.map((p, i) => <Page key={`${p?.folio}-${i}`} page={p} />)}

            {leaf && (
              <BookCtx.Provider value={leafCtx}>
                <div key={turning.key} className={`vw-leaf ${turning.dir > 0 ? "next" : "prev"}`} aria-hidden="true">
                  <Page page={leaf.front} className="front" />
                  <Page page={leaf.back} className="back" />
                </div>
              </BookCtx.Provider>
            )}
          </div>
        </div>

        <nav className="vw-nav" aria-label="Pages">
          <button className="vw-arrow" onClick={() => turnTo(unit - 1)} disabled={unit === 0} aria-label="Previous page">‹</button>
          <div className="vw-where" aria-live="polite">
            <small>{chapter.numeral ? (chapter.id === "epilogue" ? "Epilogue" : `Chapter ${chapter.numeral}`) : "Prologue"}</small>
            <span>{chapter.title}</span>
          </div>
          <button className="vw-arrow" onClick={() => turnTo(unit + 1)} disabled={unit === lastUnit} aria-label="Next page">›</button>
          <span className="vw-hint">Use ← → to turn the pages</span>
        </nav>

        {toc && (
          <div className="vw-toc-wrap" onClick={() => setToc(false)}>
            <div className="vw-toc" role="dialog" aria-modal="true" aria-label="Contents" onClick={(e) => e.stopPropagation()}>
              <button className="vw-close" onClick={() => setToc(false)} aria-label="Close contents">×</button>
              <p className="vw-kicker" style={{ textAlign: "center" }}>{BOOK_TITLE}</p>
              <h2>Contents</h2>
              <span className="vw-fleuron" style={{ margin: "10px 0 0" }}>❦</span>
              <ol>
                {CHAPTERS.map((c, i) => (
                  <li key={c.id}>
                    <button onClick={() => goTo(c.id)} aria-current={i === chapterIdx}>
                      <span className="n">{c.numeral || ""}</span>
                      <span className="t">{c.title}</span>
                      <span className="dots" />
                      <span className="p">{i ? i * 2 : "—"}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="vw-small" style={{ textAlign: "center", marginTop: 24 }}>
                <a href="/">← View the classic site</a>
              </p>
            </div>
          </div>
        )}
      </main>
    </BookCtx.Provider>
  );
}
