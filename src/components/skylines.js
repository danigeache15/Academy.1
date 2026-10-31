// Silhouette data for the world panorama. Each city is drawn in its own tile, 320 tall
// (ground line at y = GROUND); the tiles sit side by side. Generators are seeded so server and client agree.

export const W = 1600;
export const H = 320;
export const GROUND = 262;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;

/* ---------- Nature ---------- */

// Rolling hills from 0 to `width`, starting and ending at the same height so copies can loop.
export function hills(r, { y, amp, width = W, step = 140 }) {
  const pts = [[0, y - amp / 2]];
  for (let x = step; x < width - step / 2; x += step * (0.7 + r() * 0.6)) pts.push([x, y - r() * amp]);
  pts.push([width, y - amp / 2]);
  let d = `M0 ${H} L0 ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    d += ` Q${f(x1)} ${f(y1)} ${f((x1 + x2) / 2)} ${f((y1 + y2) / 2)}`;
  }
  return `${d} L${width} ${f(pts[pts.length - 1][1])} L${width} ${H} Z`;
}

// A band of conifers between x0 and x1.
export function forest(r, { x0, x1, y, h }) {
  let d = `M${x0} ${H} L${x0} ${y} L${x1} ${y} L${x1} ${H} Z`;
  for (let x = x0; x < x1; x += 7 + r() * 9) {
    const w = 12 + r() * 12, th = h * (0.45 + r() * 0.75);
    d += ` M${f(x)} ${y + 2} L${f(x + w / 2)} ${f(y - th)} L${f(x + w)} ${y + 2} Z`;
  }
  return d;
}

// Round-topped deciduous trees, for parks and riverbanks.
export function grove(r, { x0, x1, y, h }) {
  let d = `M${x0} ${H} L${x0} ${y} L${x1} ${y} L${x1} ${H} Z`;
  for (let x = x0; x < x1; x += 14 + r() * 14) {
    const rad = h * (0.35 + r() * 0.4);
    d += ` M${f(x - rad)} ${y + 2} a${f(rad)} ${f(rad * 1.1)} 0 0 1 ${f(rad * 2)} 0 Z`;
  }
  return d;
}

/* ---------- City fill ---------- */

// Generic skyline blocks; returns the path and the rectangles (for lit windows).
export function blocks(r, { x0, x1, y = GROUND, min, max, wMin = 18, wMax = 44 }) {
  let d = "";
  const rects = [];
  for (let x = x0; x < x1;) {
    const w = wMin + r() * (wMax - wMin), h = min + r() * (max - min), top = y - h;
    d += ` M${f(x)} ${y + 1} V${f(top)} H${f(x + w)} V${y + 1} Z`;
    if (r() < 0.3) d += ` M${f(x + w * 0.22)} ${f(top + 1)} V${f(top - 10 - r() * 10)} H${f(x + w * 0.78)} V${f(top + 1)} Z`;
    if (r() < 0.18) d += ` M${f(x + w / 2 - 1)} ${f(top)} V${f(top - 18 - r() * 16)} h2 V${f(top)} Z`;
    rects.push({ x, y: top, w, h });
    x += w + (r() < 0.25 ? 2 + r() * 6 : 0);
  }
  return { d, rects };
}

// Parisian rows: mansard roofs and chimneys.
export function mansards(r, { x0, x1, y = GROUND, min = 46, max = 70 }) {
  let d = "";
  const rects = [];
  for (let x = x0; x < x1;) {
    const w = 40 + r() * 40, h = min + r() * (max - min), top = y - h, roof = 14 + r() * 8;
    d += ` M${f(x)} ${y + 1} V${f(top)} L${f(x + 6)} ${f(top - roof)} H${f(x + w - 6)} L${f(x + w)} ${f(top)} V${y + 1} Z`;
    for (let c = x + 10; c < x + w - 12; c += 14 + r() * 16) d += ` M${f(c)} ${f(top - roof + 1)} v${f(-6 - r() * 6)} h5 v${f(12)} Z`;
    rects.push({ x, y: top, w, h });
    x += w;
  }
  return { d, rects };
}

// A few lit windows inside the given rectangles.
export function windows(r, rects, p = 0.08) {
  const out = [];
  rects.forEach(({ x, y, w, h }) => {
    for (let wy = y + 8; wy < GROUND - 8; wy += 10)
      for (let wx = x + 5; wx < x + w - 6; wx += 8)
        if (r() < p) out.push({ x: f(wx), y: f(wy), d: f(r() * 8) });
  });
  return out;
}

/* ---------- Landmarks (drawn by hand, anchored at their base centre) ---------- */

const L = {
  bigBen: (x, y = GROUND) =>
    `M${x - 16} ${y + 1} V${y - 128} H${x + 16} V${y + 1} Z` +
    ` M${x - 19} ${y - 126} V${y - 160} H${x + 19} V${y - 126} Z` +
    ` M${x - 19} ${y - 160} L${x} ${y - 196} L${x + 19} ${y - 160} Z` +
    ` M${x - 1.5} ${y - 194} L${x} ${y - 222} L${x + 1.5} ${y - 194} Z` +
    ` M${x - 21} ${y - 160} v-8 h4 v8 Z M${x + 17} ${y - 160} v-8 h4 v8 Z` +
    ` M${x - 40} ${y + 1} V${y - 60} H${x - 16} V${y + 1} Z M${x + 16} ${y + 1} V${y - 52} H${x + 64} V${y + 1} Z`,
  bigBenClock: (x, y = GROUND) => ({ cx: x, cy: y - 143, r: 9 }),

  towerBridge: (x, y = GROUND) => {
    const tower = (tx) =>
      ` M${tx - 15} ${y + 1} V${y - 118} H${tx + 15} V${y + 1} Z` +
      ` M${tx - 15} ${y - 118} L${tx} ${y - 146} L${tx + 15} ${y - 118} Z` +
      ` M${tx - 17} ${y - 118} v-14 l2 -6 l2 6 v14 Z M${tx + 13} ${y - 118} v-14 l2 -6 l2 6 v14 Z`;
    return tower(x) + tower(x + 170) +
      ` M${x + 15} ${y - 104} H${x + 155} v8 H${x + 15} Z` +
      ` M${x - 110} ${y - 30} H${x + 280} v8 H${x - 110} Z`;
  },
  towerBridgeCables: (x, y = GROUND) =>
    `M${x - 110} ${y - 28} Q${x - 50} ${y - 40} ${x - 15} ${y - 100} M${x + 185} ${y - 100} Q${x + 220} ${y - 40} ${x + 280} ${y - 28}`,

  empire: (x, y = GROUND) =>
    `M${x - 36} ${y + 1} V${y - 78} H${x + 36} V${y + 1} Z` +
    ` M${x - 26} ${y - 76} V${y - 128} H${x + 26} V${y - 76} Z` +
    ` M${x - 17} ${y - 126} V${y - 166} H${x + 17} V${y - 126} Z` +
    ` M${x - 9} ${y - 164} V${y - 184} H${x + 9} V${y - 164} Z` +
    ` M${x - 4} ${y - 182} L${x} ${y - 224} L${x + 4} ${y - 182} Z`,

  chrysler: (x, y = GROUND) =>
    `M${x - 20} ${y + 1} V${y - 140} H${x + 20} V${y + 1} Z` +
    ` M${x - 16} ${y - 138} Q${x} ${y - 170} ${x + 16} ${y - 138} Z` +
    ` M${x - 11} ${y - 150} Q${x} ${y - 182} ${x + 11} ${y - 150} Z` +
    ` M${x - 6} ${y - 165} Q${x} ${y - 192} ${x + 6} ${y - 165} Z` +
    ` M${x - 1.5} ${y - 186} L${x} ${y - 214} L${x + 1.5} ${y - 186} Z`,

  liberty: (x, y = GROUND) =>
    `M${x - 22} ${y + 1} L${x - 16} ${y - 28} H${x + 16} L${x + 22} ${y + 1} Z` +
    ` M${x - 9} ${y - 28} V${y - 50} H${x + 9} V${y - 28} Z` +
    ` M${x - 6} ${y - 50} Q${x - 9} ${y - 80} ${x - 4} ${y - 96} L${x + 5} ${y - 96} Q${x + 9} ${y - 78} ${x + 6} ${y - 50} Z` +
    ` M${x} ${y - 96} a5 5 0 1 1 0.1 0 Z` +
    ` M${x + 4} ${y - 90} L${x + 11} ${y - 118} L${x + 14} ${y - 117} L${x + 8} ${y - 88} Z`,
  libertyTorch: (x, y = GROUND) => ({ cx: x + 12.5, cy: y - 122, r: 3.5 }),

  eiffel: (x, y = GROUND) =>
    `M${x - 62} ${y + 1} Q${x - 26} ${y - 70} ${x - 13} ${y - 150} L${x - 5} ${y - 196} L${x - 1.5} ${y - 200} L${x} ${y - 230}` +
    ` L${x + 1.5} ${y - 200} L${x + 5} ${y - 196} L${x + 13} ${y - 150} Q${x + 26} ${y - 70} ${x + 62} ${y + 1}` +
    ` L${x + 36} ${y + 1} Q${x} ${y - 66} ${x - 36} ${y + 1} Z` +
    ` M${x - 40} ${y - 66} H${x + 40} v-7 H${x - 40} Z M${x - 19} ${y - 140} H${x + 19} v-6 H${x - 19} Z`,

  tokyoTower: (x, y = GROUND) =>
    `M${x - 44} ${y + 1} Q${x - 16} ${y - 60} ${x - 9} ${y - 120} L${x - 4} ${y - 168} L${x - 1} ${y - 172} L${x} ${y - 214}` +
    ` L${x + 1} ${y - 172} L${x + 4} ${y - 168} L${x + 9} ${y - 120} Q${x + 16} ${y - 60} ${x + 44} ${y + 1}` +
    ` L${x + 24} ${y + 1} Q${x} ${y - 44} ${x - 24} ${y + 1} Z` +
    ` M${x - 20} ${y - 98} H${x + 20} v-10 H${x - 20} Z M${x - 9} ${y - 150} H${x + 9} v-8 H${x - 9} Z`,

  pagoda: (x, y = GROUND) => {
    let d = `M${x - 1} ${y - 150} L${x} ${y - 176} L${x + 1} ${y - 150} Z`;
    for (let i = 0; i < 5; i++) {
      const b = y - i * 28, w = 34 - i * 5;
      d += ` M${x - w * 0.6} ${b + 1} V${b - 18} H${x + w * 0.6} V${b + 1} Z`;
      d += ` M${x - w - 6} ${b - 16} Q${x - w * 0.5} ${b - 20} ${x - w * 0.55} ${b - 26} H${x + w * 0.55} Q${x + w * 0.5} ${b - 20} ${x + w + 6} ${b - 16} Z`;
    }
    return d;
  },

  // Mount Fuji with its snow cap, base starting at x0 (500 wide).
  fuji: (x0) => `M${x0} ${GROUND} L${x0 + 222} 112 Q${x0 + 250} 96 ${x0 + 278} 112 L${x0 + 500} ${GROUND} Z`,
  fujiSnow: (x0) =>
    `M${x0 + 186} 134 L${x0 + 222} 112 Q${x0 + 250} 96 ${x0 + 278} 112 L${x0 + 316} 134 L${x0 + 296} 130 L${x0 + 284} 142 L${x0 + 266} 128 L${x0 + 250} 140 L${x0 + 234} 128 L${x0 + 216} 142 L${x0 + 202} 130 Z`,

  // Colosseum: three arcaded tiers, the right side worn down. Arches come back as `holes`.
  colosseum: (x, y = GROUND) =>
    `M${x - 120} ${y + 1} V${y - 104} Q${x - 60} ${y - 112} ${x + 10} ${y - 110} L${x + 30} ${y - 110} L${x + 44} ${y - 96}` +
    ` L${x + 66} ${y - 92} L${x + 80} ${y - 74} L${x + 104} ${y - 70} L${x + 120} ${y - 52} V${y + 1} Z`,
  colosseumArches: (x, y = GROUND) => {
    let d = "";
    const tiers = [[y - 8, 26, 120], [y - 42, 22, 104], [y - 72, 18, 74]];
    tiers.forEach(([base, h, reach], t) => {
      for (let ax = x - 112; ax < x + reach - 14; ax += 17) {
        if (t === 2 && ax > x + 20) break;
        d += ` M${ax} ${base} v${-h + 5} a5 5 0 0 1 10 0 v${h - 5} Z`;
      }
    });
    return d;
  },
  cypress: (x, y = GROUND, h = 70) => `M${x - 6} ${y + 1} Q${x - 9} ${y - h * 0.55} ${x} ${y - h} Q${x + 9} ${y - h * 0.55} ${x + 6} ${y + 1} Z`,

  pyramids: (x, y = GROUND) =>
    `M${x - 150} ${y + 1} L${x - 30} ${y - 128} L${x + 92} ${y + 1} Z` +
    ` M${x + 40} ${y + 1} L${x + 130} ${y - 92} L${x + 222} ${y + 1} Z` +
    ` M${x + 190} ${y + 1} L${x + 245} ${y - 54} L${x + 300} ${y + 1} Z`,
  // Palm trunk and fronds, drawn as strokes.
  palm: (x, y = GROUND, h = 70) => {
    const tx = x + 10, ty = y - h;
    return ` M${x} ${y} Q${x + 2} ${y - h * 0.6} ${tx} ${ty}` +
      ` M${tx} ${ty} q-18 -6 -30 8 M${tx} ${ty} q-10 -16 -26 -14 M${tx} ${ty} q4 -18 16 -20 M${tx} ${ty} q18 -8 30 4 M${tx} ${ty} q14 4 22 18`;
  },

  burj: (x, y = GROUND) => {
    let d = "";
    const steps = [[26, 70], [21, 110], [16, 145], [12, 175], [8, 200], [5, 218]];
    let prev = y + 1;
    steps.forEach(([w, top]) => { d += ` M${x - w} ${prev} V${y - top} H${x + w * 0.8} V${prev} Z`; prev = y - top + 1; });
    return d + ` M${x - 2} ${y - 216} L${x} ${y - 248} L${x + 1.5} ${y - 216} Z`;
  },

  // Sydney Opera House: overlapping shells on a podium.
  opera: (x, y = GROUND) => {
    const sail = (x0, w, h) => ` M${x0} ${y - 14} C${x0} ${y - 14 - h * 0.6} ${x0 + w * 0.4} ${y - 14 - h} ${x0 + w} ${y - 14 - h} C${x0 + w * 0.72} ${y - 14 - h * 0.5} ${x0 + w * 0.82} ${y - 30} ${x0 + w} ${y - 14} Z`;
    return `M${x - 20} ${y + 1} V${y - 16} H${x + 230} V${y + 1} Z` +
      sail(x, 64, 74) + sail(x + 42, 56, 60) + sail(x + 82, 44, 44) + sail(x + 140, 50, 54) + sail(x + 176, 40, 40);
  },
  harbourBridge: (x, y = GROUND) => `M${x} ${y - 40} H${x + 300} v6 H${x} Z M${x + 4} ${y + 1} V${y - 52} h14 V${y + 1} Z M${x + 282} ${y + 1} V${y - 52} h14 V${y + 1} Z`,
  harbourArch: (x, y = GROUND) => ` M${x + 18} ${y - 44} Q${x + 150} ${y - 150} ${x + 282} ${y - 44} M${x + 18} ${y - 30} Q${x + 150} ${y - 128} ${x + 282} ${y - 30}`,

  // Corcovado with Christ the Redeemer on the summit.
  corcovado: (x, y = GROUND) =>
    `M${x - 150} ${y + 1} Q${x - 60} ${y - 70} ${x - 14} ${y - 150} L${x + 14} ${y - 150} Q${x + 70} ${y - 60} ${x + 150} ${y + 1} Z` +
    ` M${x - 3} ${y - 149} V${y - 178} h6 V${y - 149} Z M${x - 19} ${y - 174} h38 v4 h-38 Z M${x} ${y - 183} a4 4 0 1 1 0.1 0 Z`,
  sugarloaf: (x0, y = GROUND) => `M${x0} ${y} C${x0 + 10} ${y - 110} ${x0 + 90} ${y - 150} ${x0 + 140} ${y - 90} C${x0 + 160} ${y - 60} ${x0 + 190} ${y - 20} ${x0 + 220} ${y} Z`,
};

/* ---------- The panorama ---------- */

// Each city is a tile of its own width, laid out in travel order; the last tile loops back to the first.
const CITY_DEFS = {
  london: { w: 880, seed: 11, anchor: [210, 28] },
  paris: { w: 660, seed: 37, anchor: [320, 22] },
  rome: { w: 640, seed: 41, anchor: [300, 120] },
  cairo: { w: 680, seed: 43, anchor: [180, 100] },
  dubai: { w: 600, seed: 47, anchor: [300, 6] },
  tokyo: { w: 780, seed: 51, anchor: [560, 36] },
  sydney: { w: 780, seed: 53, anchor: [130, 150] },
  rio: { w: 720, seed: 59, anchor: [200, 12] },
  newyork: { w: 760, seed: 23, anchor: [330, 26] },
};
export const CITIES = Object.keys(CITY_DEFS);
export const PANORAMA_W = CITIES.reduce((sum, c) => sum + CITY_DEFS[c].w, 0);

function buildCity(name) {
  const def = CITY_DEFS[name];
  const r = rng(def.seed);
  const s = { far: "", mid: "", front: "", holes: "", windows: [], lights: [], strokes: "", snow: "", anchor: def.anchor, w: def.w };

  if (name === "london") {
    s.mid = forest(r, { x0: 0, x1: 150, y: GROUND - 6, h: 36 }) + grove(r, { x0: 760, x1: 880, y: GROUND - 4, h: 32 });
    const a = blocks(r, { x0: 120, x1: 190, min: 30, max: 64 }), b = blocks(r, { x0: 770, x1: 860, min: 24, max: 50 });
    s.front = a.d + b.d + L.bigBen(230) + L.towerBridge(470);
    s.strokes = L.towerBridgeCables(470);
    s.windows = windows(r, [...a.rects, ...b.rects]);
    s.lights = [L.bigBenClock(230)];
  }
  if (name === "paris") {
    s.mid = forest(r, { x0: 0, x1: 110, y: GROUND - 6, h: 30 }) + grove(r, { x0: 580, x1: 660, y: GROUND - 4, h: 28 });
    const a = mansards(r, { x0: 100, x1: 250 }), b = mansards(r, { x0: 390, x1: 580 });
    s.front = a.d + b.d + L.eiffel(320);
    s.windows = windows(r, [...a.rects, ...b.rects], 0.12);
  }
  if (name === "rome") {
    s.mid = L.cypress(60, GROUND, 64) + L.cypress(84, GROUND, 82) + L.cypress(108, GROUND, 58) +
      L.cypress(500, GROUND, 76) + L.cypress(526, GROUND, 60) + grove(r, { x0: 540, x1: 640, y: GROUND - 4, h: 26 });
    const a = blocks(r, { x0: 130, x1: 175, min: 24, max: 40 });
    s.front = a.d + L.colosseum(300);
    s.holes = L.colosseumArches(300);
    s.windows = windows(r, a.rects, 0.1);
  }
  if (name === "cairo") {
    s.mid = grove(r, { x0: 500, x1: 680, y: GROUND - 4, h: 22 });
    s.strokes = L.palm(40, GROUND, 64) + L.palm(70, GROUND, 52) + L.palm(560, GROUND, 70) + L.palm(600, GROUND, 56) + L.palm(636, GROUND, 66);
    const a = blocks(r, { x0: 520, x1: 560, min: 20, max: 36 });
    s.front = a.d + L.pyramids(210);
    s.windows = windows(r, a.rects, 0.12);
  }
  if (name === "dubai") {
    s.mid = blocks(r, { x0: 80, x1: 560, min: 50, max: 130, wMin: 18, wMax: 32 }).d;
    const a = blocks(r, { x0: 120, x1: 260, min: 40, max: 110, wMin: 16, wMax: 28 }), b = blocks(r, { x0: 340, x1: 520, min: 40, max: 100, wMin: 16, wMax: 28 });
    s.front = a.d + b.d + L.burj(300);
    s.strokes = L.palm(40, GROUND, 58) + L.palm(560, GROUND, 62);
    s.windows = windows(r, [...a.rects, ...b.rects], 0.12);
  }
  if (name === "tokyo") {
    s.far = L.fuji(40);
    s.snow = L.fujiSnow(40);
    s.mid = forest(r, { x0: 0, x1: 260, y: GROUND - 6, h: 34 }) + L.pagoda(150);
    const a = blocks(r, { x0: 420, x1: 520, min: 40, max: 100 }), b = blocks(r, { x0: 600, x1: 760, min: 40, max: 110 });
    s.front = a.d + b.d + L.tokyoTower(560);
    s.windows = windows(r, [...a.rects, ...b.rects], 0.1);
  }
  if (name === "sydney") {
    s.mid = grove(r, { x0: 640, x1: 780, y: GROUND - 4, h: 28 }) + blocks(r, { x0: 680, x1: 770, min: 40, max: 90 }).d;
    s.front = L.opera(80) + L.harbourBridge(400);
    s.strokes = L.harbourArch(400);
  }
  if (name === "rio") {
    s.far = L.sugarloaf(430);
    s.mid = grove(r, { x0: 0, x1: 60, y: GROUND - 4, h: 26 });
    const a = blocks(r, { x0: 320, x1: 440, min: 24, max: 56 });
    s.front = a.d + L.corcovado(200);
    s.strokes = L.palm(470, GROUND, 60) + L.palm(510, GROUND, 50) + L.palm(690, GROUND, 64);
    s.windows = windows(r, a.rects, 0.12);
  }
  if (name === "newyork") {
    s.mid = blocks(r, { x0: 220, x1: 700, min: 60, max: 150, wMin: 22, wMax: 40 }).d + grove(r, { x0: 0, x1: 60, y: GROUND - 2, h: 24 });
    const a = blocks(r, { x0: 220, x1: 290, min: 50, max: 120 }), b = blocks(r, { x0: 470, x1: 720, min: 50, max: 130 });
    s.front = a.d + b.d + L.empire(330) + L.chrysler(440) + L.liberty(100);
    s.windows = windows(r, [...a.rects, ...b.rects], 0.1);
    s.lights = [L.libertyTorch(100)];
  }
  return s;
}

export function buildPanorama() {
  const r = rng(7);
  let x = 0;
  const cities = CITIES.map((name) => {
    const c = { name, x, ...buildCity(name) };
    x += c.w;
    return c;
  });
  return { hills: hills(r, { y: 214, amp: 38, width: PANORAMA_W, step: 160 }), cities };
}
