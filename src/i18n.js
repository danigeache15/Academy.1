import BRAND from "./brand";

const I18N = {
  en: {
    nav: {
      courses: "Levels",
      method: "Method",
      teachers: "Academy",
      pricing: "Programs",
      blog: "Resources",
      test: "Level test",
      cta: "Sign up",
    },
    hero: {
      eyebrow: "English + professional communication · B1+",
      title1: "You have the knowledge.",
      title2: "Learn to communicate it",
      title3: "in English.",
      sub: "You already understand English. Now learn to speak it spontaneously and with confidence — at work, when you travel, with friends around the world and in your first professional opportunities. Online, flexible and focused on real-life communication.",
      cta: "Find your level",
      cta2: "Sign up",
      stat1n: "B1+",
      stat1l: "recommended English level",
      stat2n: "18–30",
      stat2l: "students and young professionals",
      stat3n: "3 levels",
      stat3l: "from Foundation to Opportunity",
      coach: "DANIELA · COACH",
      you: "YOU",
      bubble1: "So, tell me about yourself.",
      bubble2: "I'm studying engineering, I tutor other students and I work part-time at a restaurant…",
      typing: "typing…",
      badgeTop: "B1+ → PRO",
      badgeSub: "from knowing to communicating",
      tag1: "Live online sessions",
      tag2: "Real-life roleplays",
      tag3: "Personalized feedback"
    },
    marquee: ["ENGLISH MASTERY", "COMMUNICATION", "PUBLIC SPEAKING", "PERSONAL BRANDING", "NETWORKING", "LEADERSHIP"],
    statement: {
      text: "You have the knowledge. Learn to communicate it in English. You understand more than you think. What's missing is the confidence to say it — spontaneously, in your own voice. We help you bring it out.",
      accents: ["knowledge.", "communicate", "voice.", "out."]
    },
    world: {
      eyebrow: "Speak to the world",
      title1: "We help you communicate with",
      title2: "the whole world.",
      sub: "From a coffee in London to a job interview in New York — English connects you with people, places and opportunities everywhere you want to go.",
      greetings: ["Hello!", "Let's talk!", "Nice to meet you!", "Welcome!", "How are you?", "Cheers!", "G'day, mate!", "Let's go!", "Great to see you!"],
      alt: "Night panorama of London, Paris, Rome, Cairo, Dubai, Tokyo, Sydney, Rio de Janeiro and New York"
    },
    teachers: {
      eyebrow: "The academy",
      title: "Five pillars. One goal: communicating your value.",
      sub: "Not just an English course. English you can actually use: how you present yourself, how you speak and how you connect with people from anywhere.",
      meet: "Meet the founder",
      list: [
        { name: "English Mastery", tag: "PILLAR", desc: "Develop the core English proficiency needed to express your ideas clearly and confidently in academic, professional and everyday situations." },
        { name: "Communication", tag: "PILLAR", desc: "Speak spontaneously, join conversations with ease and build real connections — with classmates, customers or friends from other countries." },
        { name: "Public Speaking", tag: "PILLAR", desc: "Transform your voice into a powerful tool for influence, learning to present complex ideas with clarity and professional poise." },
        { name: "Personal Branding", tag: "PILLAR", desc: "Define your unique professional identity and craft a digital presence that showcases your expertise and value to the world." },
        { name: "Networking & Leadership", tag: "PILLAR", desc: "Build a robust professional network and develop the leadership skills required to navigate future academic and career opportunities." }
      ]
    },
    courses: {
      eyebrow: "The learning journey",
      title: "Three levels.",
      title2: "From knowing to achieving.",
      sub: "Each level builds on the last: first the foundation, then your professional profile, and finally practice in real situations.",
      list: [
        { code: "01", name: "Foundation", weeks: "Level 1", color: "lime", desc: "Building the English and communication foundation needed for the rest of the academy. Focus on practical speaking, confidence-building, and introductory personal branding. “I can communicate who I am, what I know and what I can offer.”" },
        { code: "02", name: "Professional", weeks: "Level 2", color: "orange", desc: "Deepening your English while focusing on personal branding, public speaking, leadership, and networking. “I can confidently communicate my value and present myself as a professional.”" },
        { code: "03", name: "Opportunity", weeks: "Level 3", color: "navy", desc: "Applying everything you've learned in realistic professional situations: job interviews, professional introductions, and an individual action plan for your future. “I know how to use what I have learned to pursue the opportunities I want.”" }
      ],
      tableHeads: ["Level", "Name", "Stage", "What you'll achieve"],
      cta: "I want to start"
    },
    method: {
      eyebrow: "The learning method",
      title: "Learn. Practice. Get feedback. Apply.",
      sub: "A four-step cycle repeated at every level, so what you learn becomes something you can actually use — not just information.",
      steps: [
        { n: "01", t: "Learn", d: "Master the fundamentals of English and professional communication through structured theory and academic rigor." },
        { n: "02", t: "Practice", d: "Engage in live online sessions and roleplays based on real-world scenarios — meeting new people, traveling, serving customers and job interviews." },
        { n: "03", t: "Feedback", d: "Receive personalized, expert feedback to refine your presentation and communication skills continuously." },
        { n: "04", t: "Apply", d: "Bridge the gap between knowledge and confidence by applying your skills to professional networking and leadership." }
      ]
    },
    test: {
      eyebrow: "Level test · 3 min",
      title: "Are you ready for the academy?",
      sub: "The academy is designed for B1 and above. Answer 5 questions and we'll estimate your CEFR level.",
      start: "Start test",
      next: "Next",
      retry: "Try again",
      book: "Sign up with this result",
      progress: "Question",
      result: "Your estimated level",
      questions: [
        { q: "Choose the correct sentence:", options: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not like coffee."], correct: 2 },
        { q: "If I _____ you, I would take the job.", options: ["am", "was", "were", "be"], correct: 2 },
        { q: "By next year, she _____ in this company for ten years.", options: ["will work", "will have worked", "would work", "works"], correct: 1 },
        { q: "The proposal was met with _____ approval from the board.", options: ["unanimous", "uniform", "united", "universal"], correct: 0 },
        { q: "Hardly _____ the door when the phone rang.", options: ["I had closed", "had I closed", "I closed", "did I close"], correct: 1 }
      ],
      levels: [
        { score: 0, code: "A1", name: "Beginner", msg: "You're just starting. We recommend reaching B1 before joining." },
        { score: 1, code: "A2", name: "Elementary", msg: "You've got the basics. A bit more practice and you'll reach B1." },
        { score: 2, code: "B1", name: "Intermediate", msg: "You're ready! Foundation is your starting point." },
        { score: 3, code: "B2", name: "Upper Intermediate", msg: "Great base. Let's turn it into professional communication." },
        { score: 4, code: "C1", name: "Advanced", msg: "Your English is solid. Now let's communicate your value." },
        { score: 5, code: "C2", name: "Proficiency", msg: "You master the language. Let's focus on branding and leadership." }
      ]
    },
    pricing: {
      eyebrow: "Academy programs",
      title: "Academy sessions and workshops.",
      sub: "Flexible, practical options that fit around your classes and work. Choose the one that best matches your goals and budget.",
      currency: "CZK",
      plans: [
        { name: "Conversation Club", tag: "Practice session", price: 50, unit: "/session", per: "Speak confidently with practice sessions.", cta: "Book now", highlight: false },
        { name: "Branding Workshop", tag: "Workshop", price: 100, unit: "/workshop", per: "Build your personal brand for success.", cta: "Book now", highlight: true },
        { name: "Communication Mastery", tag: "Course", price: 150, unit: "/course", per: "Boost your English communication skills.", cta: "View course", status: "Ended", highlight: false }
      ],
      guarantee: "Not sure which program to choose? Take the level test and we'll guide you."
    },
    blog: {
      eyebrow: "Free resources",
      title: "Learn something, right now.",
      sub: "Mini-lessons on English and professional communication. Free, no login.",
      posts: [
        { tag: "Interviews", title: "'Tell me about yourself': the answer that actually works", read: "6 min", color: "orange" },
        { tag: "Public Speaking", title: "5 phrases to open a presentation with confidence", read: "5 min", color: "lime" },
        { tag: "Networking", title: "What to say after 'Nice to meet you'", read: "4 min", color: "navy" },
        { tag: "Personal Branding", title: "Your LinkedIn profile in English, step by step", read: "7 min", color: "ink" }
      ],
      all: "See all resources"
    },
    cta: {
      title: "Ready to communicate?",
      sub: "For B1+ university students and young professionals aged 18–30 who want to speak English with confidence — for better jobs, travel and international friendships. Take the first step: find your level and sign up.",
      btn: "Sign up",
      btn2: "Chat on WhatsApp"
    },
    founder: {
      eyebrow: "Founder",
      title: "The story behind the academy",
      name: BRAND.owner,
      role: `Founder · ${BRAND.name}`,
      card: "Founder & Coach",
      badge: "COACH",
      bio1: `${BRAND.owner} founded ${BRAND.name} with one clear mission: helping students and young professionals who already have the knowledge to communicate it in English with clarity and confidence.`,
      bio2: "The academy brings English, communication, public speaking, personal branding and networking together in a single journey, because knowing something isn't enough — you also need to know how to tell it.",
      linkedin: "Connect on LinkedIn"
    },
    footer: {
      tag: "You already have the knowledge. Learn how to communicate it.",
      navTitle: "Navigation",
      companyTitle: "Academy",
      legalTitle: "Legal",
      about: "About us",
      careers: "Programs",
      contact: "Contact",
      press: "Resources",
      terms: "Terms",
      privacy: "Privacy",
      cookies: "Cookies",
      copy: `© 2026 ${BRAND.name}. All rights reserved.`,
      lang: `Founded by ${BRAND.owner}.`
    },
    chat: {
      title: "Got questions?",
      sub: "We'll get back to you soon",
      placeholder: "Type your question…",
      send: "Send",
      preset1: "What level do I need?",
      preset2: "Can I study around my classes and job?",
      preset3: "Which program fits me?",
      bot: `Hi! 👋 This is ${BRAND.name}. How can we help?`,
      reply: "Thanks! We'll reply soon. In the meantime, want to take the level test?"
    }
  }
};

export default I18N;
