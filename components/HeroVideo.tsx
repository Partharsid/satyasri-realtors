"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping background video with a poster fallback.
 * Respects prefers-reduced-motion and Save-Data by staying on the poster.
 */
export default function HeroVideo({ poster, className = "" }: { poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const apply = () => {
      if (reduce.matches || saveData) video.pause();
      else video.play().catch(() => {});
    };
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
    >
      <source src="/media/hero-720.mp4" type="video/mp4" media="(max-width: 767px)" />
      <source src="/media/hero.webm" type="video/webm" />
      <source src="/media/hero.mp4" type="video/mp4" />
    </video>
  );
}
