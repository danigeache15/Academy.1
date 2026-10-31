"use client";

import { useEffect, useState } from "react";
import I18N from "../i18n";
import BRAND from "../brand";
import { LogoFull } from "../components/Logo";
import Statement from "../sections/Statement";
import World from "../sections/World";

// Proposal B: the same site told in the night palette of the world panorama,
// with a few white sections in between for rhythm.
const t = { ...I18N.en, lang: "en" };
const pad = (n) => String(n).padStart(2, "0");

// Reveals [data-reveal] (this page) and .reveal (shared sections) on first sight.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".vb [data-reveal], .vb .reveal");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in", "in");
      io.unobserve(e.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Head({ index, label, title, sub, center }) {
  return (
    <header className={`vb-head${center ? " center" : ""}`} data-reveal>
      <p className="vb-label"><span>({pad(index)})</span>{label}</p>
      <h2 className="vb-h2">{title}</h2>
      {sub && <p className="vb-lead">{sub}</p>}
    </header>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["courses", t.nav.courses], ["method", t.nav.method], ["teachers", t.nav.teachers], ["pricing", t.nav.pricing], ["blog", t.nav.blog]];
  return (
    <nav className={`vb-nav${solid ? " solid" : ""}`}>
      <a href="#top" aria-label={BRAND.name}><LogoFull size={34} mono /></a>
      <div className="vb-links">{links.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</div>
      <a href="#cta" className="vb-btn gold small">{t.nav.cta} <i>→</i></a>
    </nav>
  );
}

function Hero() {
  const h = t.hero;
  return (
    <section id="top" className="vb-hero vb-night">
      <div className="vb-stars" aria-hidden="true" />
      <div className="vb-container vb-hero-grid">
        <div>
          <span className="vb-chip vb-rise"><b />{h.eyebrow}</span>
          <h1 className="vb-h1">
            <span className="vb-line"><span style={{ "--d": ".05s" }}>{h.title1}</span></span>
            <span className="vb-line"><span style={{ "--d": ".18s" }}><em>{h.title2}</em></span></span>
            <span className="vb-line"><span style={{ "--d": ".3s" }}>{h.title3}</span></span>
          </h1>
          <p className="vb-hero-sub vb-rise" style={{ "--d": ".5s" }}>{h.sub}</p>
          <div className="vb-actions vb-rise" style={{ "--d": ".65s" }}>
            <a href="#test" className="vb-btn gold">{h.cta} <i>→</i></a>
            <a href="#cta" className="vb-btn ghost-light">{h.cta2}</a>
          </div>
        </div>

        <div className="vb-session vb-rise" style={{ "--d": ".4s" }} aria-hidden="true">
          <div className="vb-session-top"><span className="live"><b />Live</span><span>24:18</span></div>
          <div className="vb-msg coach"><span className="who">{h.coach}</span><p>{h.bubble1}</p></div>
          <div className="vb-msg you"><span className="who">{h.you}</span><p>{h.bubble2}</p></div>
          <div className="vb-msg coach typing"><p><i /><i /><i /> {h.typing}</p></div>
          <div className="vb-session-tags">{[h.tag1, h.tag2, h.tag3].map((x) => <span key={x}>✓ {x}</span>)}</div>
        </div>
      </div>

      <div className="vb-container vb-stats vb-rise" style={{ "--d": ".8s" }}>
        {[[h.stat1n, h.stat1l], [h.stat2n, h.stat2l], [h.stat3n, h.stat3l]].map(([n, l]) => (
          <div key={n}><strong>{n}</strong><span>{l}</span></div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="vb-marquee" aria-hidden="true">
      <div className="vb-marquee-track">{items.map((m, i) => <span key={i}>{m.toLowerCase()}<b>✦</b></span>)}</div>
    </div>
  );
}

function Method() {
  return (
    <section id="method" className="vb-section vb-night">
      <div className="vb-container">
        <Head index={1} label={t.method.eyebrow} title={t.method.title} sub={t.method.sub} />
        <ol className="vb-steps">
          {t.method.steps.map((s, i) => (
            <li key={s.n} data-reveal style={{ "--d": `${i * 0.1}s` }}>
              <span className="vb-num">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Levels() {
  return (
    <section id="courses" className="vb-section vb-light">
      <div className="vb-container">
        <Head index={2} label={t.courses.eyebrow} title={<>{t.courses.title} <em>{t.courses.title2}</em></>} sub={t.courses.sub} />
        <div className="vb-levels">
          {t.courses.list.map((l, i) => {
            const [text, quote] = l.desc.split("“");
            return (
              <article key={l.code} className="vb-level" data-reveal style={{ "--d": `${i * 0.12}s`, "--c": `var(--${l.color})` }}>
                <div className="vb-level-top">
                  <span className="vb-level-tag"><b />{l.weeks}</span>
                  <span className="vb-level-num">{l.code}</span>
                </div>
                <h3>{l.name}</h3>
                <p>{text.trim()}</p>
                {quote && <blockquote>“{quote}</blockquote>}
                <a href="#test" className="vb-level-cta">{t.courses.cta} <i>→</i></a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Academy() {
  const [open, setOpen] = useState(0);
  return (
    <section id="teachers" className="vb-section vb-ink">
      <div className="vb-container">
        <Head index={3} label={t.teachers.eyebrow} title={t.teachers.title} sub={t.teachers.sub} />
        <ul className="vb-pillars">
          {t.teachers.list.map((p, i) => (
            <li key={p.name} className={open === i ? "open" : ""} data-reveal style={{ "--d": `${i * 0.06}s` }}>
              <button onClick={() => setOpen(i)} onMouseEnter={() => setOpen(i)} aria-expanded={open === i}>
                <span className="vb-num">{pad(i + 1)}</span>
                <span className="name">{p.name}</span>
                <span className="plus" aria-hidden="true" />
              </button>
              <div className="body"><p>{p.desc}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LevelTest() {
  const [state, setState] = useState("idle");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState(null);
  const qs = t.test.questions;
  const start = () => { setState("playing"); setStep(0); setAnswers([]); setPicked(null); };
  const next = () => {
    if (picked == null) return;
    const a = [...answers, picked === qs[step].correct];
    setAnswers(a);
    setPicked(null);
    if (step + 1 < qs.length) setStep(step + 1); else setState("done");
  };
  const score = answers.filter(Boolean).length;
  const result = t.test.levels[score];

  return (
    <section id="test" className="vb-section vb-light">
      <div className="vb-container vb-split">
        <Head index={4} label={t.test.eyebrow} title={t.test.title} sub={t.test.sub} />
        <div className="vb-quiz" data-reveal>
          {state === "idle" && (
            <div className="vb-quiz-idle">
              <span className="vb-quiz-mark">?</span>
              <p>5 questions · no email needed</p>
              <button className="vb-btn gold" onClick={start}>{t.test.start} <i>→</i></button>
            </div>
          )}
          {state === "playing" && (
            <div>
              <div className="vb-quiz-progress"><span>{t.test.progress} {step + 1} / {qs.length}</span><i style={{ "--w": `${(step / qs.length) * 100}%` }} /></div>
              <h3>{qs[step].q}</h3>
              <div className="vb-options">
                {qs[step].options.map((o, i) => (
                  <button key={i} aria-pressed={picked === i} onClick={() => setPicked(i)}><span>{String.fromCharCode(65 + i)}</span>{o}</button>
                ))}
              </div>
              <button className="vb-btn gold wide" disabled={picked == null} onClick={next}>{t.test.next} <i>→</i></button>
            </div>
          )}
          {state === "done" && (
            <div className="vb-quiz-done">
              <p className="vb-label">{t.test.result}</p>
              <strong>{result.code}</strong>
              <h3>{result.name}</h3>
              <p>{result.msg}</p>
              <small>{score} / {qs.length} correct</small>
              <div className="vb-actions center">
                <button className="vb-btn ghost-light" onClick={start}>{t.test.retry}</button>
                <a className="vb-btn gold" href="#cta">{t.test.book}</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section id="pricing" className="vb-section vb-night">
      <div className="vb-stars" aria-hidden="true" />
      <div className="vb-container">
        <Head index={5} label={t.pricing.eyebrow} title={t.pricing.title} sub={t.pricing.sub} center />
        <div className="vb-plans">
          {t.pricing.plans.map((p, i) => (
            <article key={p.name} className={`vb-plan${p.highlight ? " feature" : ""}${p.status ? " ended" : ""}`} data-reveal style={{ "--d": `${i * 0.1}s` }}>
              <p className="vb-label">{p.status ? `${p.tag} · ${p.status}` : p.tag}</p>
              <h3>{p.name}</h3>
              <p className="per">{p.per}</p>
              <div className="price"><strong>{p.price}</strong> {t.pricing.currency}<span>{p.unit}</span></div>
              <a href="#cta" className={`vb-btn ${p.highlight ? "ink" : "ghost-light"} wide`} aria-disabled={!!p.status}>{p.cta}</a>
            </article>
          ))}
        </div>
        <p className="vb-note" data-reveal>{t.pricing.guarantee}</p>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section id="blog" className="vb-section vb-light">
      <div className="vb-container">
        <Head index={6} label={t.blog.eyebrow} title={t.blog.title} sub={t.blog.sub} />
        <ul className="vb-posts">
          {t.blog.posts.map((p, i) => (
            <li key={p.title} data-reveal style={{ "--d": `${i * 0.06}s`, "--c": `var(--${p.color === "ink" ? "navy" : p.color})` }}>
              <a href="#">
                <span className="tag">{p.tag}</span>
                <span className="title">{p.title}</span>
                <span className="read">{p.read}</span>
                <span className="arrow">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Founder() {
  const f = t.founder;
  return (
    <section id="founder" className="vb-section vb-light vb-founder-wrap">
      <div className="vb-container vb-founder">
        {/* Left blank until the founder's photo is ready */}
        <div className="vb-portrait" data-reveal><span className="vb-portrait-name">{f.name}<small>{f.card}</small></span></div>
        <div data-reveal style={{ "--d": ".1s" }}>
          <p className="vb-label"><span>({pad(7)})</span>{f.eyebrow}</p>
          <h2 className="vb-h2">{f.title}</h2>
          <p className="vb-quote">“{f.bio2}”</p>
          <p className="vb-body">{f.bio1}</p>
          <p className="vb-sign">{f.name}<span>{f.role}</span></p>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="vb-cta vb-night">
      <div className="vb-stars" aria-hidden="true" />
      <div className="vb-container vb-cta-inner" data-reveal>
        <span className="vb-chip"><b />{BRAND.name}</span>
        <h2 className="vb-h1 small">{t.cta.title}</h2>
        <p>{t.cta.sub}</p>
        <div className="vb-actions center">
          <a className="vb-btn gold" href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">{t.cta.btn} <i>→</i></a>
          <a className="vb-btn ghost-light" href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer"><b className="wa">●</b> {t.cta.btn2}</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const f = t.footer;
  return (
    <footer className="vb-footer">
      <div className="vb-container">
        <div className="vb-footer-top">
          <div>
            <LogoFull size={40} mono />
            <p className="vb-footer-tag">{f.tag}</p>
          </div>
          <div className="vb-footer-cols">
            <div><h4>{f.navTitle}</h4><a href="#courses">{t.nav.courses}</a><a href="#method">{t.nav.method}</a><a href="#teachers">{t.nav.teachers}</a><a href="#test">{t.nav.test}</a></div>
            <div><h4>{f.companyTitle}</h4><a href="#founder">{f.about}</a><a href="#pricing">{f.careers}</a><a href="#cta">{f.contact}</a><a href="#blog">{f.press}</a></div>
            <div><h4>{f.legalTitle}</h4><a href="#">{f.terms}</a><a href="#">{f.privacy}</a><a href="#">{f.cookies}</a></div>
          </div>
        </div>
        <div className="vb-footer-bottom"><span>{f.copy}</span><span>{f.lang}</span></div>
      </div>
    </footer>
  );
}

export default function ProposalB() {
  useReveal();
  return (
    <main className="vb">
      <Nav />
      <Hero />
      <Marquee />
      <Statement t={t} />
      <Method />
      <Levels />
      <World t={t} />
      <Academy />
      <LevelTest />
      <Programs />
      <Resources />
      <Founder />
      <FinalCTA />
      <Footer />
    </main>
  );
}
