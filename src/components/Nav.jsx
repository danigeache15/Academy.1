import { useState, useEffect } from "react";
import { LogoFull } from "./Logo";

export default function Nav({ t }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "courses", label: t.nav.courses },
    { id: "method", label: t.nav.method },
    { id: "teachers", label: t.nav.teachers },
    { id: "pricing", label: t.nav.pricing },
    { id: "blog", label: t.nav.blog },
  ];

  const go = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 100,
    transition: "background .25s ease, border-color .25s ease, padding .25s ease",
    background: scrolled ? "color-mix(in srgb, var(--paper) 92%, transparent)" : "transparent",
    backdropFilter: scrolled ? "blur(14px) saturate(160%)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(14px) saturate(160%)" : "none",
    borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: scrolled ? "10px 24px" : "18px 24px" }}>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ textDecoration: "none" }}>
          <LogoFull size={scrolled ? 36 : 42} />
        </a>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              style={{ background: "transparent", border: 0, font: "inherit", fontWeight: 600, fontSize: 14, color: "var(--ink)", padding: "6px 0", position: "relative" }}
              className="nav-link"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => go("cta")}
            className="btn btn-primary"
            style={{ padding: "10px 18px", fontSize: 14 }}
          >
            {t.nav.cta}
            <span aria-hidden style={{ fontSize: 16 }}>→</span>
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setMobileOpen((o) => !o)}
            style={{ padding: "10px 14px", display: "none" }}
            aria-label="Menu"
            id="mobile-toggle"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} style={{ background: "transparent", border: 0, font: "inherit", fontWeight: 600, fontSize: 15, color: "var(--ink)", padding: "10px 0", textAlign: "left" }}>
              {l.label}
            </button>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-link::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -2px;
          height: 2px; background: var(--orange); transform: scaleX(0);
          transform-origin: left; transition: transform .2s ease;
        }
        .nav-link:hover::after { transform: scaleX(1); }
        @media (max-width: 920px) {
          .nav-links { display: none !important; }
          #mobile-toggle { display: flex !important; }
        }
      ` }} />
    </nav>
  );
}
