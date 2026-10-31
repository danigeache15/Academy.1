import { useState, useEffect } from "react";
import { LogoFull } from "../components/Logo";
import FloatingShapes from "../components/FloatingShapes";
import BRAND from "../brand";

const CTA_SHAPES = [
  { type: "megaphone", color: "lime", x: 0.09, y: 0.24, z: 0, scale: 1.1, rot: [0.2, 0.5, 0.3] },
  { type: "speech", color: "navy", x: 0.89, y: 0.76, z: -1, scale: 1 , rot: [0.1, -0.5, -0.1] },
  { type: "network", color: "lime", x: 0.92, y: 0.2, z: -2, scale: 0.7, hideOnMobile: true },
  { type: "quote", color: "navy", x: 0.11, y: 0.84, z: -2, scale: 0.7, rot: [0.2, 0.4, 0], hideOnMobile: true },
];


export function FinalCTA({ t }) {
  return (
    <section id="cta" className="section" style={{ background: "var(--orange)", color: "var(--white)", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)", position: "relative", overflow: "hidden" }}>
      <FloatingShapes shapes={CTA_SHAPES} />

      <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 760 }}>
        <h2 className="display" style={{ fontSize: "clamp(48px, 7vw, 96px)", margin: 0, color: "var(--white)" }}>
          {t.cta.title}
        </h2>
        <p style={{ fontSize: 19, marginTop: 20, opacity: 0.95 }}>{t.cta.sub}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          <button className="btn btn-dark btn-lg" style={{ background: "var(--ink)" }}>
            {t.cta.btn} →
          </button>
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-lg"
            style={{ background: "var(--white)", color: "var(--ink)" }}
          >
            <span style={{ color: "#25D366" }}>●</span> {t.cta.btn2}
          </a>
        </div>
      </div>
    </section>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--lime)", margin: 0, marginBottom: 16 }}>
        {title}
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it, i) => (
          <li key={i}>
            <a href="#" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14 }}
              onMouseOver={(e) => e.currentTarget.style.color = "var(--orange)"}
              onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}>
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ t }) {
  return (
    <footer className="bg-ink" style={{ color: "var(--white)", paddingTop: 64, paddingBottom: 32 }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40 }} className="footer-grid">
          <div>
            <LogoFull size={44} mono={true} />
            <p style={{ marginTop: 20, fontSize: 15, opacity: 0.7, maxWidth: 320 }}>
              {t.footer.tag}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {["IG", "TT", "YT", "LI"].map((s) => (
                <a key={s} href="#" style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)",
                  color: "var(--white)", textDecoration: "none",
                }}>{s}</a>
              ))}
            </div>
          </div>

          <FooterCol title={t.footer.navTitle} items={[t.nav.courses, t.nav.method, t.nav.teachers, t.nav.test]} />
          <FooterCol title={t.footer.companyTitle} items={[t.footer.about, t.footer.careers, t.footer.contact, t.footer.press]} />
          <FooterCol title={t.footer.legalTitle} items={[t.footer.terms, t.footer.privacy, t.footer.cookies]} />
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, fontSize: 13, opacity: 0.6 }}>
          <span>{t.footer.copy}</span>
          <span>{t.footer.lang}</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 520px) { .footer-grid { grid-template-columns: 1fr !important; } }
      ` }} />
    </footer>
  );
}

export function ChatWidget({ t }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: t.chat.bot }]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMessages([{ from: "bot", text: t.chat.bot }]);
  }, [t.chat.bot]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "you", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: t.chat.reply }]);
    }, 700);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 90, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      {open && (
        <div className="card card-pop" style={{ background: "var(--white)", width: 320, padding: 0, overflow: "hidden", animation: "slideUp .25s ease" }}>
          <div style={{ background: "var(--navy)", color: "var(--white)", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--ink)" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t.chat.title}</div>
              <div style={{ fontSize: 11, opacity: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lime)" }} />
                {t.chat.sub}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: 0, color: "var(--white)", fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ padding: 16, maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, background: "var(--paper)" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === "bot" ? "flex-start" : "flex-end",
                background: m.from === "bot" ? "var(--white)" : "var(--lime)",
                border: "1.5px solid var(--ink)",
                borderRadius: m.from === "bot" ? "12px 12px 12px 2px" : "12px 12px 2px 12px",
                padding: "8px 12px",
                fontSize: 13,
                maxWidth: 240,
              }}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ padding: 12, display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid var(--line)", background: "var(--paper-2)" }}>
            {[t.chat.preset1, t.chat.preset2, t.chat.preset3].map((p, i) => (
              <button key={i} onClick={() => send(p)} style={{ fontSize: 11, padding: "5px 9px", background: "var(--white)", border: "1.5px solid var(--ink)", borderRadius: 999, fontWeight: 600, cursor: "pointer" }}>{p}</button>
            ))}
          </div>
          <div style={{ padding: 12, display: "flex", gap: 6, borderTop: "1px solid var(--line)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder={t.chat.placeholder}
              style={{ flex: 1, padding: "8px 12px", border: "1.5px solid var(--ink)", borderRadius: 999, fontFamily: "inherit", fontSize: 13, outline: "none" }}
            />
            <button onClick={() => send(input)} className="btn btn-primary" style={{ padding: "8px 14px", fontSize: 12, borderWidth: 1.5 }}>→</button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((o) => !o)} aria-label="Open chat" style={{
        width: 60, height: 60, borderRadius: "50%",
        background: open ? "var(--ink)" : "var(--orange)",
        color: "var(--white)",
        border: "2px solid var(--ink)",
        boxShadow: "var(--shadow-pop)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, cursor: "pointer",
        transition: "all .15s ease",
      }}>
        {open ? "×" : "💬"}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }` }} />
    </div>
  );
}
