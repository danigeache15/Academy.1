// Silhouette data for the world panorama. Each city is drawn in its own 1600×320 tile
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

  fuji: () => `M330 ${GROUND} L610 108 Q640 92 670 108 L960 ${GROUND} Z`,
  fujiSnow: () => `M570 131 L610 108 Q640 92 670 108 L712 132 L690 128 L676 140 L656 126 L640 138 L622 126 L604 140 L590 128 Z`,
};

/* ---------- The panorama ---------- */

export const CITIES = ["london", "newyork", "paris", "tokyo"];
export const PANORAMA_W = W * CITIES.length;

// Where each city's greeting bubble floats (tile coordinates).
const ANCHORS = { london: [680, 30], newyork: [780, 26], paris: [820, 22], tokyo: [960, 36] };

function buildCity(name) {
  const r = rng({ london: 11, newyork: 23, paris: 37, tokyo: 51 }[name]);
  const s = { far: "", mid: "", front: "", windows: [], lights: [], strokes: "", snow: "", anchor: ANCHORS[name] };

  if (name === "london") {
    s.mid = forest(r, { x0: 0, x1: 520, y: GROUND - 6, h: 38 }) + grove(r, { x0: 1180, x1: 1600, y: GROUND - 4, h: 34 });
    const a = blocks(r, { x0: 300, x1: 640, min: 30, max: 70 }), b = blocks(r, { x0: 1150, x1: 1400, min: 26, max: 58 });
    s.front = a.d + b.d + L.bigBen(680) + L.towerBridge(880);
    s.strokes = L.towerBridgeCables(880);
    s.windows = windows(r, [...a.rects, ...b.rects]);
    s.lights = [L.bigBenClock(680)];
  }

  if (name === "newyork") {
    const back = blocks(r, { x0: 420, x1: 1260, min: 60, max: 150, wMin: 22, wMax: 40 });
    s.mid = back.d + grove(r, { x0: 0, x1: 300, y: GROUND - 2, h: 26 });
    const a = blocks(r, { x0: 460, x1: 720, min: 50, max: 120 }), b = blocks(r, { x0: 920, x1: 1240, min: 50, max: 130 });
    s.front = a.d + b.d + L.empire(780) + L.chrysler(890) + L.liberty(240);
    s.windows = windows(r, [...a.rects, ...b.rects], 0.1);
    s.lights = [L.libertyTorch(240)];
  }

  if (name === "paris") {
    s.mid = forest(r, { x0: 0, x1: 420, y: GROUND - 6, h: 30 }) + grove(r, { x0: 1240, x1: 1600, y: GROUND - 4, h: 30 });
    const a = mansards(r, { x0: 360, x1: 740 }), b = mansards(r, { x0: 900, x1: 1300 });
    s.front = a.d + b.d + L.eiffel(820);
    s.windows = windows(r, [...a.rects, ...b.rects], 0.12);
  }

  if (name === "tokyo") {
    s.far = L.fuji();
    s.snow = L.fujiSnow();
    s.mid = forest(r, { x0: 0, x1: 560, y: GROUND - 6, h: 36 }) + L.pagoda(420);
    const a = blocks(r, { x0: 640, x1: 900, min: 40, max: 110 }), b = blocks(r, { x0: 1020, x1: 1460, min: 40, max: 120 });
    s.front = a.d + b.d + L.tokyoTower(960);
    s.windows = windows(r, [...a.rects, ...b.rects], 0.1);
  }
  return s;
}

export function buildPanorama() {
  const r = rng(7);
  return {
    hills: hills(r, { y: 214, amp: 38, width: PANORAMA_W, step: 160 }),
    cities: CITIES.map((name) => ({ name, ...buildCity(name) })),
  };
}
