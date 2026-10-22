"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Flat, outlined 3D shapes that echo the site's bold-border style.
// Colors come from the palette's CSS tokens.
const GEOMETRIES = {
  triangle: () => new THREE.CylinderGeometry(1, 1, 0.35, 3),
  box: () => new THREE.BoxGeometry(1.3, 1.3, 1.3),
  ico: () => new THREE.IcosahedronGeometry(0.9, 0),
  torus: () => new THREE.TorusGeometry(0.75, 0.28, 10, 24),
  bubble: () => new THREE.SphereGeometry(0.8, 14, 10),
  octa: () => new THREE.OctahedronGeometry(0.9, 0),
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
      const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), lineMat));
      mesh.scale.setScalar(s.scale ?? 1);
      mesh.rotation.set(s.rot?.[0] ?? 0.4, s.rot?.[1] ?? 0.2, s.rot?.[2] ?? 0);
      scene.add(mesh);
      return { mesh, mat, cfg: s, phase: i * 1.7 };
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
      const narrow = w < 900;
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
      items.forEach(({ mesh, cfg, phase }) => {
        const base = mesh.userData.base;
        const depth = 0.4 + (cfg.z ?? 0) * 0.08;
        mesh.position.set(
          base.x + pointer.x * depth,
          base.y + Math.sin(t * 0.8 + phase) * 0.35 - pointer.y * depth,
          base.z
        );
        mesh.rotation.x += 0.003 * (cfg.spin ?? 1);
        mesh.rotation.y += 0.005 * (cfg.spin ?? 1);
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
