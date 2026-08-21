"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

// Splits "928", "10+" or "1,200" into the digits and whatever surrounds them,
// so only the number animates and a suffix like "+" stays put.
const PARTS = /^(\D*)([\d.,]+)(\D*)$/;

// useLayoutEffect would warn during SSR; this component renders its final
// value on the server, so fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// easeOutCubic: exponential easing lands ~97% of the count in the first
// fraction of the duration, which reads as a snap followed by a crawl.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CountUp({
  value,
  className = "",
  duration = 1700,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const match = value.match(PARTS);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = Number(digits.replace(/,/g, ""));
  const grouped = digits.includes(",");
  const canAnimate = Boolean(match) && Number.isFinite(target) && target > 0;

  // The digits are written straight to the DOM rather than held in state:
  // a counter updates every frame, and that many React renders is wasteful.
  const format = (n: number) =>
    `${prefix}${grouped ? n.toLocaleString() : String(n)}${suffix}`;

  // Reset to the start value before the browser paints, so the final number
  // rendered on the server never visibly flashes first.
  useIsoLayoutEffect(() => {
    const node = numRef.current;
    if (!node || !canAnimate || prefersReducedMotion()) return;
    node.textContent = format(0);
  }, [canAnimate, value]);

  useEffect(() => {
    const root = rootRef.current;
    const node = numRef.current;
    // Reduced motion leaves the server-rendered number exactly as it is.
    if (!root || !node || !canAnimate || prefersReducedMotion()) return;

    let raf = 0;
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      node.textContent = format(Math.round(easeOutCubic(t) * target));
      if (t < 1) raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAnimate, value, duration, target]);

  // Screen readers get the final value once; the ticking digits are hidden
  // so they are not announced on every frame.
  return (
    <span ref={rootRef} className={className}>
      <span ref={numRef} aria-hidden="true" className="tabular-nums">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
