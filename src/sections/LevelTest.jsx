import { useState } from "react";

export default function LevelTest({ t, onBook }) {
  const [state, setState] = useState("idle");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState(null);

  const qs = t.test.questions;
  const lvls = t.test.levels;

  const start = () => { setState("playing"); setStep(0); setAnswers([]); setPicked(null); };
  const onPick = (i) => setPicked(i);
  const onNext = () => {
    if (picked == null) return;
    const newA = [...answers, picked === qs[step].correct];
    setAnswers(newA);
    setPicked(null);
    if (step + 1 < qs.length) setStep(step + 1);
    else setState("done");
  };

  const score = answers.filter(Boolean).length;
  const result = lvls[score] || lvls[lvls.length - 1];

  return (
    <section id="test" className="section" style={{ background: "var(--paper)", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 60, alignItems: "center" }}>
        <div className="test-text">
          <div className="eyebrow text-orange" style={{ marginBottom: 16 }}>— {t.test.eyebrow}</div>
          <h2 className="editorial" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: 0, lineHeight: 1.02 }}>
            {t.test.title}
          </h2>
          <p style={{ fontSize: 17, color: "var(--ink-700)", marginTop: 20, maxWidth: 480 }}>
            {t.test.sub}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((l, i) => (
              <span key={l} style={{
                fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)",
                padding: "6px 10px", border: "1.5px solid var(--ink)", borderRadius: 8,
                background: i < 2 ? "var(--lime-100)" : i < 4 ? "var(--orange-100)" : "var(--navy-100)",
              }}>
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="card card-pop" style={{ background: "var(--white)", padding: 32, minHeight: 380 }}>
          {state === "idle" && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center", gap: 20 }}>
              <div style={{ fontSize: 64, fontFamily: "var(--font-display)", color: "var(--orange)" }}>?</div>
              <p style={{ fontSize: 16, color: "var(--ink-700)", maxWidth: 360, margin: 0 }}>
                5 questions · no email needed
              </p>
              <button onClick={start} className="btn btn-primary btn-lg">
                {t.test.start} →
              </button>
            </div>
          )}

          {state === "playing" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--ink-500)" }}>
                  {t.test.progress} {step + 1} / {qs.length}
                </span>
                <div style={{ flex: 1, marginLeft: 16, height: 6, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${(step / qs.length) * 100}%`, height: "100%", background: "var(--orange)", transition: "width .3s ease" }} />
                </div>
              </div>
              <h3 className="editorial" style={{ fontSize: 24, margin: 0, marginBottom: 20 }}>
                {qs[step].q}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {qs[step].options.map((opt, i) => (
                  <button key={i} onClick={() => onPick(i)} style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    background: picked === i ? "var(--lime)" : "var(--white)",
                    border: `2px solid ${picked === i ? "var(--ink)" : "var(--line)"}`,
                    borderRadius: 12,
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--ink)",
                    transition: "all .15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: "50%",
                      border: "1.5px solid var(--ink)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12,
                      background: picked === i ? "var(--ink)" : "var(--paper)",
                      color: picked === i ? "var(--white)" : "var(--ink)",
                      flexShrink: 0,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <button onClick={onNext} disabled={picked == null} className="btn btn-dark" style={{
                marginTop: 20, width: "100%",
                opacity: picked == null ? 0.4 : 1,
                cursor: picked == null ? "not-allowed" : "pointer",
              }}>
                {t.test.next} →
              </button>
            </div>
          )}

          {state === "done" && (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "var(--ink-500)", textTransform: "uppercase" }}>
                {t.test.result}
              </div>
              <div className="display" style={{ fontSize: 96, color: "var(--orange)", lineHeight: 1 }}>
                {result.code}
              </div>
              <div className="editorial" style={{ fontSize: 22 }}>{result.name}</div>
              <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 360, margin: 0 }}>{result.msg}</p>
              <div style={{ fontSize: 13, color: "var(--ink-500)", fontFamily: "var(--font-mono)" }}>
                {score} / {qs.length} correct
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={start} className="btn btn-ghost">{t.test.retry}</button>
                <button onClick={onBook} className="btn btn-primary">{t.test.book}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          #test .container { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </section>
  );
}
