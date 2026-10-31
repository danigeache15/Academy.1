"use client";

import { createContext, useContext } from "react";
import I18N from "../i18n";
import BRAND from "../brand";
import { InnerLight } from "./MagicSky";

const t = I18N.en;
export const BOOK_TITLE = "The Voice Within";

// goTo(id), quiz state, and whether the page is a copy drawn on the turning leaf.
export const BookCtx = createContext(null);
const useBook = () => useContext(BookCtx);

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
const splitQuote = (desc) => {
  const [text, quote] = desc.split("“");
  return { text: text.trim(), quote: quote ? `“${quote}` : "" };
};

/* ---------- Illustrations ---------- */

function Silhouette() {
  const { inLeaf } = useBook();
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 360, margin: "0 auto", aspectRatio: "1 / 1.15" }}>
      <svg viewBox="0 0 300 345" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="vw-halo" cx="50%" cy="63%" r="45%">
            <stop offset="0" stopColor="var(--lime)" stopOpacity=".45" />
            <stop offset="1" stopColor="var(--lime)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="150" cy="215" r="125" fill="url(#vw-halo)" />
        <circle cx="150" cy="92" r="52" fill="none" stroke="var(--lime-100)" strokeWidth="1.2" />
        <path d="M40 345 C40 250 90 178 150 178 C210 178 260 250 260 345" fill="none" stroke="var(--lime-100)" strokeWidth="1.2" />
        {[...Array(9)].map((_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return <line key={i} x1={150 + Math.cos(a) * 62} y1={215 + Math.sin(a) * 62} x2={150 + Math.cos(a) * 88} y2={215 + Math.sin(a) * 88} stroke="var(--lime)" strokeOpacity=".5" strokeWidth="1" />;
        })}
      </svg>
      {inLeaf
        ? <div style={{ position: "absolute", left: "30%", top: "44%", width: "40%", height: "36%", borderRadius: "50%", background: "radial-gradient(circle, var(--lime-100), var(--lime) 30%, transparent 70%)" }} />
        : <InnerLight style={{ left: "18%", top: "36%", width: "64%", height: "52%" }} />}
    </div>
  );
}

function Constellation() {
  const pts = [[150, 40], [260, 150], [150, 260], [40, 150]];
  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: 300, display: "block", margin: "28px auto 0" }}>
      <circle cx="150" cy="150" r="110" fill="none" stroke="var(--lime-700)" strokeOpacity=".4" strokeDasharray="2 6" />
      <path d={`M${pts.map((p) => p.join(" ")).join(" L")} Z`} fill="none" stroke="var(--lime-700)" strokeWidth="1" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="22" fill="var(--page)" stroke="var(--lime-700)" />
          <text x={x} y={y + 7} textAnchor="middle" style={{ font: "600 20px var(--serif)", fill: "var(--orange-700)" }}>{ROMAN[i]}</text>
        </g>
      ))}
      <text x="150" y="157" textAnchor="middle" style={{ font: "italic 22px var(--serif)", fill: "var(--ink)" }}>repeat</text>
    </svg>
  );
}

function Path({ levels }) {
  const stops = [[60, 250], [160, 150], [250, 50]];
  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: 320, display: "block", margin: "28px auto 0" }}>
      <path d="M20 290 C 60 260, 40 230, 60 250 S 130 200, 160 150 S 220 90, 250 50 S 280 20, 290 10" fill="none" stroke="var(--ink-300)" strokeWidth="1.5" strokeDasharray="4 6" />
      {stops.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="16" fill={`var(--${levels[i].color})`} stroke="var(--ink)" strokeWidth="1" />
          <text x={x + 26} y={y + 6} style={{ font: "italic 20px var(--serif)", fill: "var(--ink)" }}>{levels[i].name}</text>
        </g>
      ))}
      <text x="250" y="22" textAnchor="middle" style={{ font: "18px var(--serif)", fill: "var(--lime-700)" }}>✦</text>
    </svg>
  );
}

function Portrait() {
  return (
    <div style={{ width: "78%", maxWidth: 300, margin: "8px auto 0", aspectRatio: "3 / 4", borderRadius: "50%", padding: 10, background: "var(--foil)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--navy-800)" }}>
        <svg viewBox="0 0 200 260" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMax slice">
          <path d="M30 260 Q30 190 100 178 Q170 190 170 260 Z" fill="var(--navy-600)" />
          <path d="M75 183 L100 203 L125 183 L115 173 L100 186 L85 173 Z" fill="var(--orange)" />
          <path d="M50 128 Q44 78 100 72 Q156 78 150 128 L156 203 Q130 188 100 188 Q70 188 44 203 Z" fill="#2A1A0A" />
          <circle cx="100" cy="128" r="48" fill="#C8956C" />
          <path d="M54 120 Q56 80 100 80 Q144 80 146 120 Q130 94 100 96 Q72 96 54 120 Z" fill="#2A1A0A" />
          <ellipse cx="84" cy="128" rx="5" ry="6" fill="#1A0A00" />
          <ellipse cx="116" cy="128" rx="5" ry="6" fill="#1A0A00" />
          <path d="M88 156 Q100 166 112 156" fill="none" stroke="#7A4A2A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- The level test, told as a mirror ---------- */

function MirrorQuiz() {
  const { quiz, setQuiz, goTo } = useBook();
  const qs = t.test.questions;
  const { state, step, answers, picked } = quiz;
  const start = () => setQuiz({ state: "playing", step: 0, answers: [], picked: null });
  const next = () => {
    if (picked == null) return;
    const a = [...answers, picked === qs[step].correct];
    setQuiz(step + 1 < qs.length
      ? { state: "playing", step: step + 1, answers: a, picked: null }
      : { state: "done", step, answers: a, picked: null });
  };

  if (state === "idle") return (
    <div style={{ textAlign: "center" }}>
      <p className="vw-kicker">{t.test.eyebrow}</p>
      <p className="vw-h" style={{ fontSize: 40 }}>Look into the mirror.</p>
      <p className="vw-p">Five questions · no email needed</p>
      <div className="vw-actions" style={{ justifyContent: "center" }}>
        <button className="vw-btn gold" onClick={start}>{t.test.start} →</button>
      </div>
    </div>
  );

  if (state === "playing") return (
    <div>
      <div className="vw-progress">{qs.map((_, i) => <i key={i} className={i <= step ? "on" : ""} />)}</div>
      <p className="vw-kicker">{t.test.progress} {ROMAN[step]} of {ROMAN[qs.length - 1]}</p>
      <h3 className="vw-h" style={{ fontSize: 30 }}>{qs[step].q}</h3>
      <div className="vw-q-opts">
        {qs[step].options.map((o, i) => (
          <button key={i} className="vw-q-opt" aria-pressed={picked === i} onClick={() => setQuiz({ ...quiz, picked: i })}>
            <span>{"abcd"[i]}</span>{o}
          </button>
        ))}
      </div>
      <div className="vw-actions"><button className="vw-btn ink" disabled={picked == null} onClick={next}>{t.test.next} →</button></div>
    </div>
  );

  const score = answers.filter(Boolean).length;
  const r = t.test.levels[score];
  return (
    <div style={{ textAlign: "center" }}>
      <p className="vw-kicker">{t.test.result}</p>
      <div className="vw-result-code vw-foil">{r.code}</div>
      <p className="vw-h" style={{ fontSize: 30 }}><em>{r.name}</em></p>
      <p className="vw-p">{r.msg}</p>
      <p className="vw-small">{score} / {qs.length} correct</p>
      <div className="vw-actions" style={{ justifyContent: "center" }}>
        <button className="vw-btn" onClick={start}>{t.test.retry}</button>
        <button className="vw-btn gold" onClick={() => goTo("epilogue")}>{t.test.book} →</button>
      </div>
    </div>
  );
}

function SparkActions() {
  const { goTo } = useBook();
  return (
    <div className="vw-actions">
      <button className="vw-btn gold" onClick={() => goTo("mirror")}>{t.hero.cta} →</button>
      <button className="vw-btn" onClick={() => goTo("epilogue")}>{t.hero.cta2}</button>
    </div>
  );
}

function BeginButton() {
  const { goTo } = useBook();
  return <button className="vw-btn gold" onClick={() => goTo("spark")}>Begin reading →</button>;
}

/* ---------- The book ---------- */
// Each chapter is a spread: a left (verso) and right (recto) page.

export const CHAPTERS = [
  {
    id: "cover",
    title: "Title page",
    left: {
      dark: true, center: true, bare: true,
      body: () => (
        <>
          <div className="vw-endpaper" />
          <div className="vw-bookplate">
            <p className="vw-kicker" style={{ marginBottom: 6 }}>✦</p>
            <p className="ex">Ex Libris</p>
            <p className="vw-small" style={{ margin: "6px 0 0" }}>This story belongs to</p>
            <div className="line">you</div>
            <p className="vw-small" style={{ fontSize: 13, margin: 0 }}>and to everything you are about to discover.</p>
          </div>
        </>
      ),
    },
    right: {
      center: true, bare: true,
      body: () => (
        <div className="vw-title-page">
          <p className="vw-kicker">{BRAND.name}</p>
          <span className="vw-fleuron">❦</span>
          <h1 className="vw-h">The Voice <em>Within</em></h1>
          <p className="vw-p" style={{ fontStyle: "italic", maxWidth: 380, margin: "18px auto 0" }}>
            A story about English, confidence, and the person you are becoming.
          </p>
          <span className="vw-fleuron">✦ ✦ ✦</span>
          <p className="vw-small" style={{ margin: "0 0 26px" }}>As told by {BRAND.owner}</p>
          <BeginButton />
        </div>
      ),
    },
  },
  {
    id: "spark",
    numeral: "I",
    title: "The Spark",
    left: { dark: true, center: true, body: () => <Silhouette /> },
    right: {
      center: true,
      body: () => (
        <>
          <p className="vw-kicker">Chapter I</p>
          <h2 className="vw-h">Everything you need is already <em>inside you.</em></h2>
          <p className="vw-p vw-drop">
            You understand English. You have ideas, knowledge and a story worth telling. What's missing isn't more
            information — it's the moment you hear your own voice say it, spontaneously and with confidence.
          </p>
          <p className="vw-p">That moment is the magic. This academy exists to help you find it.</p>
          <SparkActions />
          <p className="vw-small" style={{ marginTop: 22 }}>{t.hero.stat1n} · {t.hero.stat2n} · online & flexible</p>
        </>
      ),
    },
  },
  {
    id: "within",
    numeral: "II",
    title: "What Lies Within",
    left: {
      center: true,
      body: () => (
        <>
          <p className="vw-kicker">Chapter II</p>
          <h2 className="vw-h">Five gifts you <em>already carry.</em></h2>
          <p className="vw-p vw-drop">
            {t.teachers.sub} Nothing here is added from the outside. Each pillar draws out something that was
            always there — waiting for the right words.
          </p>
          <span className="vw-fleuron">❦</span>
        </>
      ),
    },
    right: {
      body: () => (
        <ol className="vw-list">
          {t.teachers.list.map((p, i) => (
            <li key={p.name}><span className="num">{ROMAN[i]}</span><h3>{p.name}</h3><p>{p.desc}</p></li>
          ))}
        </ol>
      ),
    },
  },
  {
    id: "ritual",
    numeral: "III",
    title: "The Ritual",
    left: {
      center: true,
      body: () => (
        <>
          <p className="vw-kicker">Chapter III · {t.method.eyebrow}</p>
          <h2 className="vw-h">Every spell is a <em>ritual.</em></h2>
          <p className="vw-p">{t.method.sub}</p>
          <Constellation />
        </>
      ),
    },
    right: {
      body: () => (
        <ol className="vw-list">
          {t.method.steps.map((s, i) => (
            <li key={s.t}><span className="num">{ROMAN[i]}</span><h3>{s.t}</h3><p>{s.d}</p></li>
          ))}
        </ol>
      ),
    },
  },
  {
    id: "journey",
    numeral: "IV",
    title: "The Journey",
    left: {
      center: true,
      body: () => (
        <>
          <p className="vw-kicker">Chapter IV · {t.courses.eyebrow}</p>
          <h2 className="vw-h">Three levels. <em>One transformation.</em></h2>
          <p className="vw-p">{t.courses.sub}</p>
          <Path levels={t.courses.list} />
        </>
      ),
    },
    right: {
      body: () => (
        <ol className="vw-list">
          {t.courses.list.map((l) => {
            const { text, quote } = splitQuote(l.desc);
            return (
              <li key={l.code}>
                <span className="num">{ROMAN[Number(l.code) - 1]}</span>
                <h3>{l.name}</h3>
                <p>{text}</p>
                {quote && <p className="vw-quote">{quote}</p>}
              </li>
            );
          })}
        </ol>
      ),
    },
  },
  {
    id: "mirror",
    numeral: "V",
    title: "The Mirror",
    left: {
      dark: true, center: true,
      body: () => (
        <>
          <p className="vw-kicker">Chapter V</p>
          <h2 className="vw-h">Every journey begins with an <em>honest look.</em></h2>
          <p className="vw-p">{t.test.sub}</p>
          <p className="vw-p" style={{ fontStyle: "italic" }}>The mirror doesn't judge. It only shows you where your story starts.</p>
        </>
      ),
    },
    right: { center: true, body: () => <MirrorQuiz /> },
  },
  {
    id: "invitations",
    numeral: "VI",
    title: "The Invitations",
    left: {
      center: true,
      body: () => (
        <>
          <p className="vw-kicker">Chapter VI · {t.pricing.eyebrow}</p>
          <h2 className="vw-h">Choose your <em>invitation.</em></h2>
          <p className="vw-p">{t.pricing.sub}</p>
          <p className="vw-small" style={{ marginTop: 22 }}>{t.pricing.guarantee}</p>
        </>
      ),
    },
    right: {
      center: true,
      body: () => (
        <div>
          {t.pricing.plans.map((p, i) => (
            <div key={p.name} className={`vw-invite${p.highlight ? " feature" : ""}${p.status ? " ended" : ""}`}>
              <span className="vw-seal">{ROMAN[i]}</span>
              <span className="tag">{p.status || p.tag}</span>
              <div className="meta">
                <h3>{p.name}</h3>
                <span className="price">{p.price} {t.pricing.currency} <small>{p.unit}</small></span>
              </div>
              <p>{p.per}</p>
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    id: "storyteller",
    numeral: "VII",
    title: "The Storyteller",
    left: { center: true, body: () => <Portrait /> },
    right: {
      center: true,
      body: () => (
        <>
          <p className="vw-kicker">Chapter VII · {t.founder.eyebrow}</p>
          <h2 className="vw-h">{BRAND.owner}</h2>
          <p className="vw-small" style={{ margin: "6px 0 0" }}>{t.founder.role}</p>
          <p className="vw-p vw-drop">{t.founder.bio1}</p>
          <p className="vw-p">{t.founder.bio2}</p>
        </>
      ),
    },
  },
  {
    id: "epilogue",
    numeral: "✦",
    title: "Your Story Begins",
    left: {
      dark: true, center: true,
      body: () => (
        <div style={{ textAlign: "center" }}>
          <p className="vw-kicker">Epilogue</p>
          <h2 className="vw-h">Every book ends. <em>Yours is just beginning.</em></h2>
          <span className="vw-fleuron" style={{ color: "var(--lime)" }}>❦</span>
          <p className="vw-p" style={{ fontStyle: "italic" }}>The next page is blank. It's yours to write.</p>
        </div>
      ),
    },
    right: {
      center: true,
      body: () => (
        <div style={{ textAlign: "center" }}>
          <p className="vw-kicker">{t.cta.title}</p>
          <p className="vw-p">{t.cta.sub}</p>
          <div className="vw-actions" style={{ justifyContent: "center" }}>
            <a className="vw-btn gold" href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">{t.cta.btn} →</a>
            <a className="vw-btn" href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">{t.cta.btn2}</a>
          </div>
          <span className="vw-fleuron">✦ ✦ ✦</span>
          <p className="vw-small" style={{ margin: 0 }}>{t.footer.tag}</p>
          <p className="vw-small" style={{ fontSize: 13 }}>{t.footer.copy}</p>
        </div>
      ),
    },
  },
];
