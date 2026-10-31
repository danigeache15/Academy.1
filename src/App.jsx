"use client";

import I18N from "./i18n";
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import Statement from "./sections/Statement";
import Methodology from "./sections/Methodology";
import Courses from "./sections/Courses";
import Teachers from "./sections/Teachers";
import World from "./sections/World";
import LevelTest from "./sections/LevelTest";
import Pricing from "./sections/Pricing";
import Blog from "./sections/Blog";
import Founder from "./sections/Founder";
import { FinalCTA, Footer, ChatWidget } from "./sections/Footer";

const t = { ...I18N.en, lang: "en" };

export default function App() {
  const scrollToCTA = () => {
    const el = document.getElementById("cta");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Nav t={t} />
      <Hero t={t} />
      <Marquee t={t} />
      <Statement t={t} />
      <Methodology t={t} />
      <Courses t={t} layout="cards" />
      <World t={t} />
      <Teachers t={t} />
      <LevelTest t={t} onBook={scrollToCTA} />
      <Pricing t={t} />
      <Blog t={t} />
      <Founder t={t} />
      <FinalCTA t={t} />
      <Footer t={t} />
      <ChatWidget t={t} />
    </>
  );
}
