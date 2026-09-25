"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Site-wide motion:
 *  - Lenis smooth scrolling for wheel/trackpad (touch keeps native momentum; off for reduced motion)
 *  - `[data-reveal]` elements get `.is-in` when they enter the viewport
 *  - `[data-count]` numbers count up once revealed
 */
export default function MotionRuntime() {
  const pathname = usePathname();

  // Smooth scroll — created once.
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 0.95,
      anchors: { offset: -90 },
      // Let elements that scroll on their own (menus, rails, maps, lightbox) keep native scrolling.
      prevent: (node) => !!node.closest?.("[data-lenis-prevent], .yarl__root, iframe"),
    });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // New page: jump to top without easing, then (re)observe reveal targets.
  useEffect(() => {
    if (!window.location.hash) window.__lenis?.scrollTo(0, { immediate: true, force: true });

    const root = document.documentElement;
    if (reducedMotion()) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          io.unobserve(el);
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          if (el.hasAttribute("data-count")) countUp(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    scan();
    // Content streamed in after hydration (Suspense, client lists) is picked up too.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    root.classList.add("motion-ready");

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

function countUp(el: HTMLElement) {
  if (el.dataset.counted) return;
  el.dataset.counted = "1";
  const target = el.dataset.count ?? el.textContent ?? "";
  const match = target.match(/^(\D*)([\d.]+)(.*)$/);
  if (!match) return;
  const [, prefix, num, suffix] = match;
  const end = parseFloat(num);
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = `${prefix}${(end * eased).toFixed(decimals)}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
