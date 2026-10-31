"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Flat, outlined 3D shapes that echo the site's bold-border style.
// Colors come from the palette's CSS tokens.

// Places a primitive and strips it down to position + normal so parts can be merged into one mesh.
function part(geo, { p = [0, 0, 0], r = [0, 0, 0], q, s = 1 } = {}) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g !== geo) geo.dispose();
  g.deleteAttribute("uv");
  const quat = q || new THREE.Quaternion().setFromEuler(new THREE.Euler(...r));
  g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...p), quat, new THREE.Vector3(s, s, s)));
  return g;
}
const merge = (...parts) => mergeGeometries(parts).center();

// A thin rod between two points (for chart arrows and network links).
function rod(a, b, radius) {
  const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b);
  const dir = to.clone().sub(from);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return part(new THREE.CylinderGeometry(radius, radius, dir.length(), 16), { p: from.add(to).multiplyScalar(0.5).toArray(), q });
}

// Communication & leadership objects.
const OBJECTS = {
  speech: () => {
    const sh = new THREE.Shape(), x0 = -0.9, y0 = -0.55, x1 = 0.9, y1 = 0.6, r = 0.32;
    sh.moveTo(x0 + r, y0);
    sh.lineTo(-0.38, y0); sh.lineTo(-0.62, -0.98); sh.lineTo(-0.08, y0);
    sh.lineTo(x1 - r, y0); sh.quadraticCurveTo(x1, y0, x1, y0 + r);
    sh.lineTo(x1, y1 - r); sh.quadraticCurveTo(x1, y1, x1 - r, y1);
    sh.lineTo(x0 + r, y1); sh.quadraticCurveTo(x0, y1, x0, y1 - r);
    sh.lineTo(x0, y0 + r); sh.quadraticCurveTo(x0, y0, x0 + r, y0);
    const body = new THREE.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 2, curveSegments: 8 });
    const dots = [-0.42, 0, 0.42].map((x) => part(new THREE.SphereGeometry(0.11, 24, 16), { p: [x, 0.03, 0.4] }));
    return merge(part(body), ...dots);
  },
  quote: () => merge(...[-0.42, 0.42].flatMap((x) => [
    part(new THREE.CylinderGeometry(0.3, 0.3, 0.3, 32), { p: [x, -0.15, 0], r: [Math.PI / 2, 0, 0] }),
    part(new THREE.BoxGeometry(0.2, 0.62, 0.3), { p: [x + 0.17, 0.2, 0], r: [0, 0, -0.45] }),
  ])),
  mic: () => merge(
    part(new THREE.SphereGeometry(0.42, 32, 20), { p: [0, 0.78, 0] }),
    part(new THREE.TorusGeometry(0.43, 0.05, 6, 20), { p: [0, 0.78, 0], r: [Math.PI / 2, 0, 0] }),
    part(new THREE.CylinderGeometry(0.22, 0.17, 0.2, 32), { p: [0, 0.36, 0] }),
    part(new THREE.CylinderGeometry(0.14, 0.1, 1.1, 32), { p: [0, -0.25, 0] }),
  ),
  megaphone: () => merge(
    part(new THREE.CylinderGeometry(0.2, 0.72, 1.15, 32, 1, true), { p: [0.35, 0, 0], r: [0, 0, -Math.PI / 2] }),
    part(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 32), { p: [-0.36, 0, 0], r: [0, 0, -Math.PI / 2] }),
    part(new THREE.BoxGeometry(0.15, 0.5, 0.15), { p: [-0.12, -0.38, 0], r: [0, 0, 0.2] }),
  ),
  flag: () => {
    const cloth = new THREE.PlaneGeometry(1.15, 0.72, 12, 1);
    const cp = cloth.attributes.position;
    for (let i = 0; i < cp.count; i++) cp.setZ(i, Math.sin((cp.getX(i) + 0.6) * 4.5) * 0.09);
    cloth.computeVertexNormals();
    return merge(
      part(new THREE.CylinderGeometry(0.045, 0.045, 2.3, 10), { p: [-0.62, 0, 0] }),
      part(new THREE.SphereGeometry(0.1, 24, 16), { p: [-0.62, 1.18, 0] }),
      part(cloth, { p: [-0.02, 0.72, 0] }),
    );
  },
  crown: () => merge(
    part(new THREE.CylinderGeometry(0.64, 0.6, 0.36, 24, 1, true)),
    ...[0, 1, 2, 3, 4].flatMap((i) => {
      const a = (i / 5) * Math.PI * 2, x = Math.cos(a) * 0.6, z = Math.sin(a) * 0.6;
      return [
        part(new THREE.ConeGeometry(0.15, 0.48, 4), { p: [x, 0.42, z] }),
        part(new THREE.SphereGeometry(0.07, 16, 12), { p: [x, 0.7, z] }),
      ];
    }),
  ),
  podium: () => merge(
    part(new THREE.BoxGeometry(0.72, 0.92, 0.72), { p: [0, 0.46, 0] }),
    part(new THREE.BoxGeometry(0.72, 0.6, 0.72), { p: [-0.74, 0.3, 0] }),
    part(new THREE.BoxGeometry(0.72, 0.4, 0.72), { p: [0.74, 0.2, 0] }),
    part(new THREE.OctahedronGeometry(0.2, 0), { p: [0, 1.22, 0] }),
  ),
  chart: () => merge(
    ...[0.42, 0.72, 1.02, 1.36].map((h, i) => part(new THREE.BoxGeometry(0.3, h, 0.3), { p: [-0.6 + i * 0.4, h / 2, 0] })),
    rod([-0.75, 0.75, 0.25], [0.55, 1.75, 0.25], 0.045),
    part(new THREE.ConeGeometry(0.12, 0.28, 10), { p: [0.6, 1.8, 0.25], r: [0, 0, -0.92] }),
  ),
  network: () => {
    const nodes = [[0, 0.75, 0], [-0.75, -0.35, 0.3], [0.75, -0.35, 0.3], [0, -0.1, -0.7]];
    const links = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].map(([a, b]) => rod(nodes[a], nodes[b], 0.04));
    return merge(...nodes.map((p) => part(new THREE.SphereGeometry(0.22, 24, 16), { p })), ...links);
  },
};

const GEOMETRIES = {
  triangle: () => new THREE.CylinderGeometry(1, 1, 0.35, 3),
  box: () => new THREE.BoxGeometry(1.3, 1.3, 1.3),
  ico: () => new THREE.IcosahedronGeometry(0.9, 0),
  torus: () => new THREE.TorusGeometry(0.75, 0.28, 10, 24),
  bubble: () => new THREE.SphereGeometry(0.8, 14, 10),
  octa: () => new THREE.OctahedronGeometry(0.9, 0),
  ...OBJECTS,
};

function readTokens(el) {
  const cs = getComputedStyle(el);
  const v = (name) => cs.getPropertyValue(name).trim() || "#000";
  return { lime: v("--lime"), orange: v("--orange"), navy: v("--navy"), sky: v("--navy-100"), ink: v("--ink") };
}

export default function FloatingShapes({ shapes, style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 14;

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(4, 6, 8);
    scene.add(sun);

    const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    const items = shapes.map((s, i) => {
      const geo = GEOMETRIES[s.type]();
      const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      // Objects only outline their main contours; abstract shapes show every facet.
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, s.type in OBJECTS ? 40 : 20), lineMat));
      mesh.scale.setScalar(s.scale ?? 1);
      mesh.rotation.set(s.rot?.[0] ?? 0.4, s.rot?.[1] ?? 0.2, s.rot?.[2] ?? 0);
      scene.add(mesh);
      // Objects sway around their pose; abstract shapes keep tumbling.
      return { mesh, mat, cfg: s, phase: i * 1.7, sway: s.type in OBJECTS, base: mesh.rotation.clone() };
    });

    const tk = readTokens(document.documentElement);
    items.forEach(({ mat, cfg }) => mat.color.set(tk[cfg.color] || tk.orange));
    lineMat.color.set(tk.ink);

    // Place shapes using fractions of the visible area so layout survives resizes.
    let viewW = 1, viewH = 1;
    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      viewH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      viewW = viewH * camera.aspect;
      // Phones and tablets have no side margins, so marked shapes would sit on top of the content.
      const narrow = w < 1200;
      items.forEach(({ mesh, cfg }) => {
        mesh.visible = !(narrow && cfg.hideOnMobile);
        mesh.userData.base = new THREE.Vector3((cfg.x - 0.5) * viewW, (0.5 - cfg.y) * viewH, cfg.z ?? 0);
      });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const render = () => {
      const t = clock.getElapsedTime();
      items.forEach(({ mesh, cfg, phase, sway, base: rot }) => {
        const base = mesh.userData.base;
        const depth = 0.4 + (cfg.z ?? 0) * 0.08;
        mesh.position.set(
          base.x + pointer.x * depth,
          base.y + Math.sin(t * 0.8 + phase) * 0.35 - pointer.y * depth,
          base.z
        );
        if (sway) {
          mesh.rotation.x = rot.x + Math.sin(t * 0.6 + phase) * 0.12;
          mesh.rotation.y = rot.y + Math.sin(t * 0.45 + phase) * 0.45 * (cfg.spin ?? 1);
          mesh.rotation.z = rot.z + Math.cos(t * 0.5 + phase) * 0.06;
        } else {
          mesh.rotation.x += 0.003 * (cfg.spin ?? 1);
          mesh.rotation.y += 0.005 * (cfg.spin ?? 1);
        }
      });
      renderer.render(scene, camera);
    };
    const loop = () => {
      render();
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    // Pause the loop while the section is off screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduceMotion) raf = requestAnimationFrame(loop);
    });
    io.observe(mount);

    if (reduceMotion) render();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      items.forEach(({ mesh, mat }) => {
        mesh.geometry.dispose();
        mesh.children.forEach((c) => c.geometry.dispose());
        mat.dispose();
      });
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [shapes]);

  return <div ref={mountRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, ...style }} />;
}
