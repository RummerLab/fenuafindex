"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Fullscreen underwater shader: layered value-noise caustics, angled light
// rays and a depth gradient, plus a drifting "marine snow" particle layer.
// Everything renders in NDC space, so no camera transforms are needed.

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const QUAD_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uScroll;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.05 + vec2(13.7, 7.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = uv;
    p.x *= aspect;

    // Depth gradient: sunlit lagoon at the top, abyss at the bottom.
    vec3 cTop = vec3(0.055, 0.320, 0.365);
    vec3 cMid = vec3(0.030, 0.150, 0.210);
    vec3 cDeep = vec3(0.012, 0.055, 0.100);
    vec3 col = mix(cDeep, cMid, smoothstep(0.0, 0.55, uv.y));
    col = mix(col, cTop, smoothstep(0.55, 1.08, uv.y));

    // Cursor position in uv space (pointer is in NDC, y flipped).
    vec2 pointerUv = vec2((uPointer.x + 1.0) * 0.5, (1.0 - uPointer.y) * 0.5);

    // Warped caustic shimmer, strongest near the surface. The cursor drags
    // the noise domain, so the water visibly stirs around it.
    // Speed and amplitude are tuned so the pattern reads as moving within a
    // second without lifting mean brightness enough to hurt text contrast.
    vec2 q = p * 3.1 + vec2(uTime * 0.131, uTime * 0.193);
    q += (uPointer * vec2(aspect, -1.0)) * 0.15 * uPointerStrength;
    float warp = fbm(q + fbm(q + uTime * 0.158));
    float caustic = pow(smoothstep(0.34, 0.82, warp), 1.7);
    float surface = 0.2 + 0.8 * smoothstep(0.3, 1.0, uv.y);
    col += caustic * surface * vec3(0.16, 0.672, 0.64);

    // Soft angled god rays.
    float ang = p.x * 0.85 + (1.0 - uv.y) * 0.5;
    float rays = sin(ang * 9.0 - uTime * 0.578) * sin(ang * 13.0 + uTime * 0.333);
    rays = smoothstep(0.45, 1.0, rays);
    col += rays * smoothstep(0.3, 1.0, uv.y) * vec3(0.05, 0.22, 0.24) * 0.9;

    // A pool of light gathering under the cursor.
    float halo = smoothstep(0.42, 0.0, length((uv - pointerUv) * vec2(aspect, 1.0)));
    col += halo * uPointerStrength * (0.35 + 0.65 * caustic) * vec3(0.06, 0.26, 0.25);

    // Gentle vignette and scroll fade into the page background.
    float vig = smoothstep(1.35, 0.4, length(uv - vec2(0.5, 0.58)));
    col *= mix(0.8, 1.0, vig);
    col *= 1.0 - uScroll * 0.45;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const SNOW_VERT = /* glsl */ `
  attribute float aScale;
  attribute float aSpeed;
  attribute float aSeed;
  uniform float uTime;
  uniform vec2 uRes;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // Slow upward drift with a lazy horizontal sway, wrapped in NDC space.
    pos.y = mod(position.y + uTime * aSpeed * 0.063 + aSeed, 2.0) - 1.0;
    pos.x += sin(uTime * 0.21 * aSpeed + aSeed * 12.0) * 0.03;
    vAlpha = 0.25 + 0.75 * fract(aSeed * 7.31);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
    gl_PointSize = aScale * uRes.y * 0.006;
  }
`;

const SNOW_FRAG = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.08, d) * vAlpha * 0.45;
    gl_FragColor = vec4(0.62, 0.9, 0.88, a);
  }
`;

export default function OceanScene({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // No WebGL — the CSS gradient fallback stays visible.
    }

    // Reduced motion tones the scene down to a slow ambient drift and drops
    // the cursor parallax entirely — it never freezes the scene outright,
    // which would read as a broken hero rather than a calmer one.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timeScale = motionQuery.matches ? 0.25 : 1;
    let pointerStrength = motionQuery.matches ? 0 : 1;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: pointerStrength },
      uScroll: { value: 0 },
    };

    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const quadMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERT,
      fragmentShader: QUAD_FRAG,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(quadGeo, quadMat);
    quad.renderOrder = 0;
    scene.add(quad);

    const COUNT = 220;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = Math.random() * 2 - 1;
      positions[i * 3 + 1] = Math.random() * 2 - 1;
      positions[i * 3 + 2] = 0;
      scales[i] = 0.35 + Math.random() * 0.9;
      speeds[i] = 0.4 + Math.random() * 1.1;
      seeds[i] = Math.random() * 2;
    }
    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    snowGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    snowGeo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    snowGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    const snowMat = new THREE.ShaderMaterial({
      vertexShader: SNOW_VERT,
      fragmentShader: SNOW_FRAG,
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });
    const snow = new THREE.Points(snowGeo, snowMat);
    snow.renderOrder = 1;
    scene.add(snow);

    const resize = () => {
      // Fall back to the viewport if the mount has not been laid out yet,
      // so the canvas never sticks at its 300x150 default.
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    window.addEventListener("resize", resize);

    const pointerTarget = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onScroll = () => {
      const h = window.innerHeight || 1;
      uniforms.uScroll.value = Math.min(window.scrollY / h, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let inView = true;

    // Seconds for the pointer to ease ~63% of the way to the cursor. Larger
    // is calmer. Applied against elapsed time rather than per frame, so a
    // 144Hz display does not chase the cursor 2.4x faster than a 60Hz one.
    const POINTER_TAU = 0.85;

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      uniforms.uTime.value += dt * timeScale;
      uniforms.uPointer.value.lerp(pointerTarget, 1 - Math.exp(-dt / POINTER_TAU));
      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      clock.getDelta(); // drop the idle gap so time does not jump
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    // Only pause for things that make the work pointless: a hidden tab or a
    // hero scrolled off screen. The loop starts immediately either way, so a
    // quiet IntersectionObserver can never leave the scene frozen.
    const sync = () => {
      if (inView && !document.hidden) start();
      else stop();
    };

    renderer.render(scene, camera);
    sync();

    const intersection = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    intersection.observe(mount);
    document.addEventListener("visibilitychange", sync);

    const onMotionChange = (event: MediaQueryListEvent) => {
      timeScale = event.matches ? 0.25 : 1;
      pointerStrength = event.matches ? 0 : 1;
      uniforms.uPointerStrength.value = pointerStrength;
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      quadGeo.dispose();
      quadMat.dispose();
      snowGeo.dispose();
      snowMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-mid via-deep to-abyss ${className}`}
    />
  );
}
