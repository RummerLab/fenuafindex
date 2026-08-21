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
    vec2 p = uv;
    p.x *= uRes.x / max(uRes.y, 1.0);

    // Depth gradient: sunlit lagoon at the top, abyss at the bottom.
    vec3 cTop = vec3(0.055, 0.320, 0.365);
    vec3 cMid = vec3(0.030, 0.150, 0.210);
    vec3 cDeep = vec3(0.012, 0.055, 0.100);
    vec3 col = mix(cDeep, cMid, smoothstep(0.0, 0.55, uv.y));
    col = mix(col, cTop, smoothstep(0.55, 1.08, uv.y));

    // Warped caustic shimmer, strongest near the surface.
    vec2 q = p * 3.1 + vec2(uTime * 0.035, uTime * 0.06) + uPointer * 0.12;
    float warp = fbm(q + fbm(q + uTime * 0.04));
    float caustic = pow(smoothstep(0.42, 0.9, warp), 2.2);
    float surface = 0.2 + 0.8 * smoothstep(0.3, 1.0, uv.y);
    col += caustic * surface * vec3(0.10, 0.42, 0.40);

    // Soft angled god rays.
    float ang = p.x * 0.85 + (1.0 - uv.y) * 0.5;
    float rays = sin(ang * 9.0 - uTime * 0.16) * sin(ang * 13.0 + uTime * 0.09);
    rays = smoothstep(0.5, 1.0, rays);
    col += rays * smoothstep(0.3, 1.0, uv.y) * vec3(0.05, 0.22, 0.24) * 0.6;

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
    pos.y = mod(position.y + uTime * aSpeed * 0.045 + aSeed, 2.0) - 1.0;
    pos.x += sin(uTime * 0.22 * aSpeed + aSeed * 12.0) * 0.03;
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

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: prefersReduced ? 40 : 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
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
      const { clientWidth: w, clientHeight: h } = mount;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

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

    const frame = () => {
      uniforms.uTime.value += Math.min(clock.getDelta(), 0.1);
      uniforms.uPointer.value.lerp(pointerTarget, 0.04);
      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || prefersReduced) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // A single styled frame for reduced-motion users; a paused loop when
    // the hero is offscreen or the tab is hidden.
    renderer.render(scene, camera);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0.02 },
    );
    intersection.observe(mount);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
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
