"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Soft, additive glow points shared by the night sky and the inner light.
const VERT = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uBurst;
  uniform float uSwirl;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.x += cos(uTime * 0.15 + aSeed * 4.0) * 0.35;
    p.y += sin(uTime * 0.21 + aSeed * 6.0) * 0.35;

    // Swirl around the book's spine; inner motes travel further.
    float r = length(p.xy);
    float a = uSwirl * (0.6 + aSeed) / (1.0 + r * 0.12);
    p.xy = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xy;
    p.xy *= 1.0 + uBurst * 0.08 * aSeed;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (1.0 + uBurst * 1.4) * (28.0 / -mv.z);

    vColor = aColor;
    vAlpha = (0.25 + 0.75 * abs(sin(uTime * (0.4 + aSeed) + aSeed * 20.0))) * (0.7 + uBurst * 0.6);
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = pow(smoothstep(0.5, 0.0, d), 2.2);
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`;

function glowMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uSwirl: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
  });
}

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n, f) => new THREE.Color(cs.getPropertyValue(n).trim() || f);
  return { gold: v("--lime", "#FFB703"), cream: v("--lime-100", "#FFF1C7"), sky: v("--navy-100", "#8ECAE6"), orange: v("--orange", "#FB8500") };
}

function makeRenderer(mount) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  mount.appendChild(renderer.domElement);
  return renderer;
}

// Full-screen night sky of gold dust. Every change of `pulse` releases a swirl in direction `dir`.
export default function MagicSky({ pulse, dir = 1 }) {
  const mountRef = useRef(null);
  const turnRef = useRef({ pulse, dir, start: -10 });

  useEffect(() => {
    if (turnRef.current.pulse !== pulse) turnRef.current = { pulse, dir, start: null };
  }, [pulse, dir]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = makeRenderer(mount);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 12;

    const pal = readPalette();
    const count = window.innerWidth < 900 ? 520 : 1100;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    const color = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -14 + Math.random() * 16;
      seed[i] = Math.random();
      const big = Math.random() < 0.06;
      size[i] = big ? 9 + Math.random() * 8 : 2.5 + Math.random() * 4;
      const c = Math.random() < 0.62 ? pal.gold : Math.random() < 0.6 ? pal.sky : pal.cream;
      c.toArray(color, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    const mat = glowMaterial();
    scene.add(new THREE.Points(geo, mat));

    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const turn = turnRef.current;
      if (turn.start === null) turn.start = t;
      const k = Math.min(Math.max((t - turn.start) / 1.6, 0), 1);
      const burst = k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0;

      mat.uniforms.uTime.value = t;
      mat.uniforms.uBurst.value = burst;
      mat.uniforms.uSwirl.value += dt * (0.02 + burst * 2.2) * -turn.dir;
      camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduceMotion) { clock.getDelta(); raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    if (reduceMotion) { mat.uniforms.uTime.value = 2; renderer.render(scene, camera); }
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

// The light inside a person: a glowing core wrapped in two slowly turning gold lattices,
// with motes orbiting it. Brightens while hovered.
export function InnerLight({ style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = makeRenderer(mount);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 6;
    const pal = readPalette();

    const lattice = (r, detail, c, opacity) => new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(r, detail)),
      new THREE.LineBasicMaterial({ color: c, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    const inner = lattice(0.75, 0, pal.gold, 0.9);
    const outer = lattice(1.35, 1, pal.sky, 0.35);
    scene.add(inner, outer);

    // Core + orbiting motes, drawn with the same glow shader as the sky.
    const n = 160;
    const pos = new Float32Array(n * 3), seed = new Float32Array(n), size = new Float32Array(n), color = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const core = i < 6;
      const r = core ? 0 : 0.9 + Math.random() * 1.1;
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
      seed[i] = Math.random();
      size[i] = core ? 9 + i * 2.5 : 2 + Math.random() * 3;
      (core ? (i < 3 ? pal.cream : pal.gold) : (Math.random() < 0.7 ? pal.gold : pal.orange)).toArray(color, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    const mat = glowMaterial();
    const motes = new THREE.Points(geo, mat);
    scene.add(motes);

    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let hover = 0, target = 0;
    const enter = () => (target = 1), leave = () => (target = 0);
    mount.addEventListener("pointerenter", enter);
    mount.addEventListener("pointerleave", leave);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      const t = clock.getElapsedTime();
      hover += (target - hover) * 0.06;
      const breath = 0.5 + 0.5 * Math.sin(t * 1.3);
      inner.rotation.set(t * 0.35, t * 0.5, 0);
      outer.rotation.set(-t * 0.18, -t * 0.25, t * 0.1);
      motes.rotation.y = t * (0.25 + hover * 0.6);
      inner.scale.setScalar(1 + breath * 0.06 + hover * 0.12);
      outer.material.opacity = 0.25 + hover * 0.35;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uBurst.value = 0.25 * breath + hover * 0.7;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    // Only animate while the page holding it is on screen.
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting && !reduceMotion) raf = requestAnimationFrame(loop);
    });
    io.observe(mount);
    if (reduceMotion) renderer.render(scene, camera);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mount.removeEventListener("pointerenter", enter);
      mount.removeEventListener("pointerleave", leave);
      [inner, outer].forEach((l) => { l.geometry.dispose(); l.material.dispose(); });
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" style={{ position: "absolute", pointerEvents: "auto", ...style }} />;
}
