"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Floating wizard hat + graduation cap, and a wand that follows the cursor and sheds sparkles.
// variant "hero": on white, all three objects. variant "cta": on the night sky, the wand alone.

const SPARK_VERT = /* glsl */ `
  attribute float aLife;
  attribute float aSize;
  attribute float aHue;
  uniform float uPixelRatio;
  varying float vLife;
  varying float vHue;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * sqrt(max(aLife, 0.0)) * uPixelRatio * (300.0 / -mv.z);
    vLife = aLife;
    vHue = aHue;
  }
`;
const SPARK_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vLife;
  varying float vHue;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(mix(uA, uB, vHue), tex.a * clamp(vLife * 1.4, 0.0, 1.0));
  }
`;

// A four-point twinkle with a soft centre, drawn once into a canvas.
function sparkleTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const glow = g.createRadialGradient(64, 64, 0, 64, 64, 30);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#fff";
  [[64, 4, 64, 124, 7], [4, 64, 124, 64, 7]].forEach(([x1, y1, x2, y2, w]) => {
    g.beginPath();
    if (x1 === x2) { g.moveTo(64, y1); g.lineTo(64 + w, 64); g.lineTo(64, y2); g.lineTo(64 - w, 64); }
    else { g.moveTo(x1, 64); g.lineTo(64, 64 - w); g.lineTo(x2, 64); g.lineTo(64, 64 + w); }
    g.fill();
  });
  return new THREE.CanvasTexture(c);
}

function wizardHat(c) {
  const group = new THREE.Group();
  const h = 2.2, pts = [];
  for (let i = 0; i <= 28; i++) {
    const y = (i / 28) * h;
    pts.push(new THREE.Vector2(Math.max(0.9 * Math.pow(1 - y / h, 1.2), 0.004), y));
  }
  const cone = new THREE.LatheGeometry(pts, 56);
  // Bend the tip over, like a hat that has seen some adventures.
  const p = cone.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    if (y > 0.9) { const t = (y - 0.9) / (h - 0.9); p.setX(i, p.getX(i) - 0.6 * t * t); p.setY(i, y - 0.22 * t * t); }
  }
  cone.computeVertexNormals();
  const felt = new THREE.MeshStandardMaterial({ color: c.navy, roughness: 0.75 });
  const gold = new THREE.MeshStandardMaterial({ color: c.gold, roughness: 0.35, metalness: 0.6, side: THREE.DoubleSide });
  group.add(new THREE.Mesh(cone, felt));
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.6, 0.06, 64), felt);
  group.add(brim);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.87, 0.92, 0.22, 56, 1, true), gold);
  band.position.y = 0.14;
  group.add(band);

  const star = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 0.045 : 0.11;
    i ? star.lineTo(Math.cos(a) * r, Math.sin(a) * r) : star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const starGeo = new THREE.ShapeGeometry(star);
  [[0.5, 0.2], [0.85, 1.3], [0.6, 2.6], [1.15, 0.9], [0.35, 4.2]].forEach(([y, a]) => {
    const r = 0.9 * Math.pow(1 - y / h, 1.2) + 0.012;
    const m = new THREE.Mesh(starGeo, gold);
    m.position.set(Math.sin(a) * r, y, Math.cos(a) * r);
    m.rotation.y = a;
    m.rotation.x = -0.35;
    group.add(m);
  });
  return group;
}

function gradCap(c) {
  const group = new THREE.Group();
  const cloth = new THREE.MeshStandardMaterial({ color: c.ink, roughness: 0.7 });
  const gold = new THREE.MeshStandardMaterial({ color: c.gold, roughness: 0.4, metalness: 0.5 });
  const board = new THREE.Mesh(new THREE.BoxGeometry(2, 0.07, 2), cloth);
  group.add(board);
  const skull = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.8, 0.6, 48), cloth);
  skull.position.y = -0.33;
  group.add(skull);
  const button = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), gold);
  button.position.y = 0.06;
  group.add(button);
  const cord = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(0.92, 0.05, 0.92)), 1, 0.018, 6), gold);
  group.add(cord);
  const tassel = new THREE.Group();
  tassel.position.set(0.94, 0.04, 0.94);
  const string = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 6), gold);
  string.position.y = -0.25;
  const fringe = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 14), gold);
  fringe.position.y = -0.58;
  tassel.add(string, fringe);
  group.add(tassel);
  group.userData.tassel = tassel;
  return group;
}

function wand(c) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: "#3B2617", roughness: 0.55 });
  const gold = new THREE.MeshStandardMaterial({ color: c.gold, roughness: 0.3, metalness: 0.7 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.055, 2.3, 16), wood);
  group.add(shaft);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.62, 16), wood);
  handle.position.y = -0.82;
  group.add(handle);
  [-0.5, -1.12].forEach((y) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.074, 0.014, 8, 24), gold);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  });
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshBasicMaterial({ color: c.cream, toneMapped: false }));
  tip.position.y = 1.16;
  group.add(tip);
  group.userData.tip = tip;
  return group;
}

export default function MagicObjects({ variant = "hero" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const night = variant === "cta";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 860;
    const cs = getComputedStyle(document.documentElement);
    const tk = (n, d) => new THREE.Color(cs.getPropertyValue(n).trim() || d);
    const c = { navy: tk("--navy", "#219EBC"), ink: tk("--navy-900", "#023047"), gold: tk("--lime", "#FFB703"), orange: tk("--orange", "#FB8500"), cream: tk("--lime-100", "#FFF1C7") };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 7;
    scene.add(new THREE.HemisphereLight(0xffffff, c.navy, night ? 0.7 : 1.3));
    const key = new THREE.DirectionalLight(0xffffff, night ? 1.2 : 1.8);
    key.position.set(3, 5, 6);
    const rim = new THREE.DirectionalLight(c.orange, 1.1);
    rim.position.set(-4, -1, -3);
    scene.add(key, rim);

    const stage = new THREE.Group();
    scene.add(stage);
    let hat = null, cap = null;
    if (!night) {
      hat = wizardHat(c);
      hat.position.set(-0.75, -0.95, 0);
      hat.rotation.set(0.12, 0.4, 0.08);
      cap = gradCap(c);
      cap.position.set(0.95, 1.05, -0.6);
      cap.rotation.set(0.42, 0.6, -0.18);
      cap.scale.setScalar(0.82);
      stage.add(hat, cap);
    }
    const w = wand(c);
    const wandBase = night ? new THREE.Vector3(-3.7, -1.3, 0.5) : new THREE.Vector3(0.75, -0.9, 1.3);
    w.position.copy(wandBase);
    stage.add(w);

    // Sparkle pool: born at the wand tip, drifting and fading.
    const N = small ? 140 : 260;
    const pos = new Float32Array(N * 3), vel = new Float32Array(N * 3), life = new Float32Array(N), decay = new Float32Array(N);
    const size = new Float32Array(N), hue = new Float32Array(N);
    for (let i = 0; i < N; i++) { size[i] = 0.18 + Math.random() * 0.3; hue[i] = Math.random(); }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    sGeo.setAttribute("aLife", new THREE.BufferAttribute(life, 1));
    sGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    sGeo.setAttribute("aHue", new THREE.BufferAttribute(hue, 1));
    const map = sparkleTexture();
    const sparkMat = () => new THREE.ShaderMaterial({
      vertexShader: SPARK_VERT, fragmentShader: SPARK_FRAG, transparent: true, depthWrite: false,
      blending: night ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: {
        uMap: { value: map }, uPixelRatio: { value: renderer.getPixelRatio() },
        uA: { value: night ? c.cream : c.gold }, uB: { value: night ? c.gold : c.orange },
      },
    });
    const sMat = sparkMat();
    const sparks = new THREE.Points(sGeo, sMat);
    sparks.frustumCulled = false;
    scene.add(sparks);

    // Ambient twinkles around the objects.
    const A = small ? 18 : 34;
    const aPos = new Float32Array(A * 3), aLife = new Float32Array(A), aSize = new Float32Array(A), aHue = new Float32Array(A), aPhase = new Float32Array(A);
    for (let i = 0; i < A; i++) {
      aPos.set(night ? [(Math.random() - 0.5) * 9, (Math.random() - 0.5) * 4.5, -1 + Math.random() * 2] : [(Math.random() - 0.5) * 4.4, (Math.random() - 0.5) * 4.6, -1 + Math.random() * 2], i * 3);
      aSize[i] = 0.2 + Math.random() * 0.3;
      aHue[i] = Math.random();
      aPhase[i] = Math.random() * 10;
    }
    const aGeo = new THREE.BufferGeometry();
    aGeo.setAttribute("position", new THREE.BufferAttribute(aPos, 3));
    aGeo.setAttribute("aLife", new THREE.BufferAttribute(aLife, 1));
    aGeo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
    aGeo.setAttribute("aHue", new THREE.BufferAttribute(aHue, 1));
    const aMat = sparkMat();
    scene.add(new THREE.Points(aGeo, aMat));

    const resize = () => {
      const width = mount.clientWidth || 1, height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Fit the composition: pull back as the canvas gets narrower than it is tall.
      camera.position.z = (night ? 8 : 8.2) * Math.max(1, 0.95 / camera.aspect);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const pointer = { x: 0, y: 0, speed: 0 };
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1, ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.speed = Math.min(pointer.speed + Math.hypot(nx - pointer.x, ny - pointer.y) * 6, 3);
      pointer.x = nx;
      pointer.y = ny;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tipPos = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0, cursor = 0, carry = 0;

    const frame = (dt) => {
      const t = clock.elapsedTime;
      stage.rotation.y += (pointer.x * 0.18 - stage.rotation.y) * 0.04;
      stage.rotation.x += (pointer.y * 0.1 - stage.rotation.x) * 0.04;

      if (hat) {
        hat.position.y = -0.95 + Math.sin(t * 0.9) * 0.08;
        hat.rotation.y = 0.4 + Math.sin(t * 0.35) * 0.25;
        cap.position.y = 1.05 + Math.sin(t * 1.1 + 1.5) * 0.1;
        cap.rotation.y = 0.6 + t * 0.12;
        cap.userData.tassel.rotation.z = Math.sin(t * 2.1) * 0.25;
        cap.userData.tassel.rotation.x = Math.cos(t * 1.7) * 0.15;
      }

      // The wand leans toward the cursor and draws small circles while idle.
      const idle = Math.sin(t * 1.6) * 0.08;
      const targetZ = (night ? -0.75 : -0.55) - pointer.x * 0.45 + idle;
      const targetX = pointer.y * 0.35 + Math.cos(t * 1.6) * 0.06;
      w.rotation.z += (targetZ - w.rotation.z) * 0.08;
      w.rotation.x += (targetX - w.rotation.x) * 0.08;
      w.position.y = wandBase.y + Math.sin(t * 1.3) * 0.06;
      w.userData.tip.getWorldPosition(tipPos);

      // Emit: a steady trickle, more while the cursor moves.
      pointer.speed *= 0.92;
      carry += dt * ((night ? 60 : 28) + pointer.speed * 90);
      while (carry >= 1) {
        carry -= 1;
        const i = cursor;
        cursor = (cursor + 1) % N;
        pos[i * 3] = tipPos.x; pos[i * 3 + 1] = tipPos.y; pos[i * 3 + 2] = tipPos.z;
        const a = Math.random() * Math.PI * 2, s = 0.2 + Math.random() * (night ? 0.9 : 0.6);
        vel[i * 3] = Math.cos(a) * s; vel[i * 3 + 1] = Math.sin(a) * s + (night ? 0.35 : 0.1); vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        life[i] = 1;
        decay[i] = 0.45 + Math.random() * 0.5;
      }
      const g = night ? 0.08 : -0.55;
      for (let i = 0; i < N; i++) {
        if (life[i] <= 0) continue;
        life[i] -= dt * decay[i];
        vel[i * 3 + 1] += g * dt;
        for (let k = 0; k < 3; k++) { vel[i * 3 + k] *= 0.985; pos[i * 3 + k] += vel[i * 3 + k] * dt; }
      }
      sGeo.attributes.position.needsUpdate = true;
      sGeo.attributes.aLife.needsUpdate = true;

      for (let i = 0; i < A; i++) aLife[i] = Math.pow(Math.max(Math.sin(t * (0.8 + (i % 5) * 0.2) + aPhase[i]), 0), 3);
      aGeo.attributes.aLife.needsUpdate = true;

      renderer.render(scene, camera);
    };
    const loop = () => { frame(Math.min(clock.getDelta(), 0.05)); raf = requestAnimationFrame(loop); };

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (e.isIntersecting && !reduceMotion) { clock.getDelta(); raf = requestAnimationFrame(loop); }
    });
    io.observe(mount);
    if (reduceMotion) { clock.elapsedTime = 1; frame(0); }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      map.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant]);

  return <div ref={mountRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}
