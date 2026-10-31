"use client";

import { useEffect, useRef, useState } from "react";
import I18N from "../i18n";
import BRAND from "../brand";
import MagicObjects from "./MagicObjects";
import Landscape from "./Landscape";

const t = I18N.en;
const pad = (n) => String(n).padStart(2, "0");

// Adds .is-in to every [data-reveal] element the first time it scrolls into view.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".pb [data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function SectionHead({ index, label, title, sub }) {
  return (
    <header className="pb-head" data-reveal>
      <p className="pb-label"><span>({pad(index)})</span>{label}</p>
      <h2 className="pb-h2">{title}</h2>
      {sub && <p className="pb-lead">{sub}</p>}
    </header>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["method", t.nav.method], ["courses", t.nav.courses], ["teachers", t.nav.teachers], ["test", t.nav.test], ["pricing", t.nav.pricing], ["blog", t.nav.blog]];
  return (
    <nav className={`pb-nav${solid ? " solid" : ""}`}>
      <a href="#top" className="pb-wordmark"><em>Communicate</em><span>Academy</span></a>
      <div className="pb-links">
        {links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </div>
      <a href="#cta" className="pb-btn small">{t.nav.cta}</a>
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" className="pb-hero">
      <div className="pb-container pb-hero-grid">
        <div className="pb-hero-copy">
          <p className="pb-label pb-rise" style={{ "--d": "0s" }}>{t.hero.eyebrow}</p>
          <h1 className="pb-h1">
            <span className="pb-line"><span style={{ "--d": ".1s" }}>Let what's already</span></span>
            <span className="pb-line"><span style={{ "--d": ".22s" }}><em>inside you</em> speak.</span></span>
          </h1>
          <p className="pb-hero-sub pb-rise" style={{ "--d": ".5s" }}>{t.hero.sub}</p>
          <div className="pb-actions pb-rise" style={{ "--d": ".65s" }}>
            <a href="#test" className="pb-btn gold">{t.hero.cta} <i>→</i></a>
            <a href="#cta" className="pb-btn ghost">{t.hero.cta2}</a>
          </div>
          <div className="pb-stats pb-rise" style={{ "--d": ".8s" }}>
            {[[t.hero.stat1n, t.hero.stat1l], [t.hero.stat2n, t.hero.stat2l], [t.hero.stat3n, t.hero.stat3l]].map(([n, l]) => (
              <div key={n}><strong>{n}</strong><span>{l}</span></div>
            ))}
          </div>
        </div>
        <div className="pb-hero-art pb-rise" style={{ "--d": ".3s" }}><MagicObjects variant="hero" /></div>
      </div>
    </section>
  );
}

// The site's original promise, lighting up word by word as it scrolls past.
function Statement() {
  const ref = useRef(null);
  const text = `${t.hero.title1} ${t.hero.title2} ${t.hero.title3} You understand more than you think. What's missing is the confidence to say it — spontaneously, in your own voice. We help you bring it out.`;
  const words = text.split(" ");
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
  }, []);
  return (
    <section id="statement" className="pb-section pb-statement">
      <div className="pb-container">
        <p className="pb-statement-text" ref={ref}>
          {words.map((w, i) => <span key={i} className={/knowledge|communicate|voice\.?|out\./.test(w) ? "accent" : ""}>{w} </span>)}
        </p>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="method" className="pb-section">
      <div className="pb-container">
        <SectionHead index={1} label={t.method.eyebrow} title={t.method.title} sub={t.method.sub} />
        <ol className="pb-steps">
          {t.method.steps.map((s, i) => (
            <li key={s.n} data-reveal style={{ "--d": `${i * 0.1}s` }}>
              <span className="pb-num">{s.n}</span>
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
    <section id="courses" className="pb-section pb-tint">
      <div className="pb-container">
        <SectionHead index={2} label={t.courses.eyebrow} title={<>{t.courses.title} <em>{t.courses.title2}</em></>} sub={t.courses.sub} />
        <div className="pb-levels">
          {t.courses.list.map((l, i) => {
            const [text, quote] = l.desc.split("“");
            return (
              <article key={l.code} className="pb-level" data-reveal style={{ "--d": `${i * 0.12}s`, "--c": `var(--${l.color})` }}>
                <div className="pb-level-top"><span>{l.weeks}</span><span className="pb-num">{l.code}</span></div>
                <h3>{l.name}</h3>
                <p>{text.trim()}</p>
                {quote && <blockquote>“{quote}</blockquote>}
              </article>
            );
          })}
        </div>
        <div className="pb-center" data-reveal><a href="#test" className="pb-btn ink">{t.courses.cta} <i>→</i></a></div>
      </div>
    </section>
  );
}

function Academy() {
  const [open, setOpen] = useState(0);
  return (
    <section id="teachers" className="pb-section">
      <div className="pb-container">
        <SectionHead index={3} label={t.teachers.eyebrow} title={t.teachers.title} sub={t.teachers.sub} />
        <ul className="pb-pillars">
          {t.teachers.list.map((p, i) => (
            <li key={p.name} className={open === i ? "open" : ""} data-reveal style={{ "--d": `${i * 0.06}s` }}>
              <button onClick={() => setOpen(i)} onMouseEnter={() => setOpen(i)} aria-expanded={open === i}>
                <span className="pb-num">{pad(i + 1)}</span>
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
    <section id="test" className="pb-section pb-tint">
      <div className="pb-container pb-split">
        <SectionHead index={4} label={t.test.eyebrow} title={t.test.title} sub={t.test.sub} />
        <div className="pb-card pb-quiz" data-reveal>
          {state === "idle" && (
            <div className="pb-quiz-idle">
              <span className="pb-quiz-mark">?</span>
              <p>5 questions · no email needed</p>
              <button className="pb-btn gold" onClick={start}>{t.test.start} <i>→</i></button>
            </div>
          )}
          {state === "playing" && (
            <div>
              <div className="pb-quiz-progress"><span>{t.test.progress} {step + 1} / {qs.length}</span><i style={{ "--w": `${(step / qs.length) * 100}%` }} /></div>
              <h3>{qs[step].q}</h3>
              <div className="pb-options">
                {qs[step].options.map((o, i) => (
                  <button key={i} aria-pressed={picked === i} onClick={() => setPicked(i)}><span>{String.fromCharCode(65 + i)}</span>{o}</button>
                ))}
              </div>
              <button className="pb-btn ink wide" disabled={picked == null} onClick={next}>{t.test.next} <i>→</i></button>
            </div>
          )}
          {state === "done" && (
            <div className="pb-quiz-done">
              <p className="pb-label">{t.test.result}</p>
              <strong>{result.code}</strong>
              <h3>{result.name}</h3>
              <p>{result.msg}</p>
              <small>{score} / {qs.length} correct</small>
              <div className="pb-actions center">
                <button className="pb-btn ghost" onClick={start}>{t.test.retry}</button>
                <a className="pb-btn gold" href="#cta">{t.test.book}</a>
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
    <section id="pricing" className="pb-section">
      <div className="pb-container">
        <SectionHead index={5} label={t.pricing.eyebrow} title={t.pricing.title} sub={t.pricing.sub} />
        <div className="pb-plans">
          {t.pricing.plans.map((p, i) => (
            <article key={p.name} className={`pb-plan${p.highlight ? " feature" : ""}${p.status ? " ended" : ""}`} data-reveal style={{ "--d": `${i * 0.1}s` }}>
              <p className="pb-label">{p.status ? `${p.tag} · ${p.status}` : p.tag}</p>
              <h3>{p.name}</h3>
              <p className="per">{p.per}</p>
              <div className="price"><strong>{p.price}</strong> {t.pricing.currency}<span>{p.unit}</span></div>
              <a href="#cta" className={`pb-btn ${p.highlight ? "gold" : "ghost"} wide`} aria-disabled={!!p.status}>{p.cta}</a>
            </article>
          ))}
        </div>
        <p className="pb-note" data-reveal>{t.pricing.guarantee}</p>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section id="blog" className="pb-section pb-tint">
      <div className="pb-container">
        <SectionHead index={6} label={t.blog.eyebrow} title={t.blog.title} sub={t.blog.sub} />
        <ul className="pb-posts">
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
        <div className="pb-center" data-reveal><a href="#" className="pb-link">{t.blog.all} →</a></div>
      </div>
    </section>
  );
}

function Founder() {
  const f = t.founder;
  return (
    <section id="founder" className="pb-section">
      <div className="pb-container pb-founder">
        <div className="pb-arch pb-arch-empty" data-reveal>
          <span className="pb-arch-spark" aria-hidden="true">✦</span>
          <span className="pb-arch-note">Animated portrait<br /><em>coming soon</em></span>
          <span className="pb-arch-badge">{f.card}</span>
        </div>
        <div data-reveal style={{ "--d": ".1s" }}>
          <p className="pb-label"><span>({pad(7)})</span>{f.eyebrow}</p>
          <h2 className="pb-h2">{f.title}</h2>
          <p className="pb-quote">“{f.bio2}”</p>
          <p className="pb-body">{f.bio1}</p>
          <p className="pb-sign">{f.name}<span>{f.role}</span></p>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="pb-cta">
      <div className="pb-cta-stars" aria-hidden="true" />
      <div className="pb-cta-art"><MagicObjects variant="cta" /></div>
      <div className="pb-container pb-cta-inner" data-reveal>
        <h2 className="pb-h1 small">{t.cta.title}</h2>
        <p>{t.cta.sub}</p>
        <div className="pb-actions center">
          <a className="pb-btn gold" href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">{t.cta.btn} <i>→</i></a>
          <a className="pb-btn ghost-light" href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer"><b className="wa">●</b> {t.cta.btn2}</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const f = t.footer;
  return (
    <footer className="pb-footer">
      <div className="pb-container">
        <div className="pb-footer-top">
          <p className="pb-footer-tag">{f.tag}</p>
          <div className="pb-footer-cols">
            <div><h4>{f.navTitle}</h4><a href="#courses">{t.nav.courses}</a><a href="#method">{t.nav.method}</a><a href="#teachers">{t.nav.teachers}</a><a href="#test">{t.nav.test}</a></div>
            <div><h4>{f.companyTitle}</h4><a href="#founder">{f.about}</a><a href="#pricing">{f.careers}</a><a href="#cta">{f.contact}</a><a href="#blog">{f.press}</a></div>
            <div><h4>{f.legalTitle}</h4><a href="#">{f.terms}</a><a href="#">{f.privacy}</a><a href="#">{f.cookies}</a></div>
          </div>
        </div>
        <div className="pb-footer-mark" aria-hidden="true"><em>Communicate</em> Academy</div>
        <div className="pb-footer-bottom"><span>{f.copy}</span><span>{f.lang}</span></div>
      </div>
    </footer>
  );
}

export default function ProposalB() {
  useReveal();
  return (
    <main className="pb">
      <Nav />
      <Hero />
      <Statement />
      <Landscape scene="london" />
      <Method />
      <Levels />
      <Landscape scene="newyork" from="var(--paper)" />
      <Academy />
      <LevelTest />
      <Landscape scene="paris" from="var(--paper)" />
      <Programs />
      <Resources />
      <Landscape scene="tokyo" from="var(--paper)" />
      <Founder />
      <FinalCTA />
      <Footer />
    </main>
  );
}
