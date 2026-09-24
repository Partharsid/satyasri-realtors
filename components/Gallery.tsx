"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Images } from "lucide-react";

export default function Gallery({ images, title, photosLabel, note }: { images: string[]; title: string; photosLabel: string; note?: string }) {
  const [index, setIndex] = useState(-1);
  if (!images.length) return null;
  const [first, ...rest] = images;
  const side = rest.slice(0, 2);

  return (
    <div>
      <div className={`grid gap-2 ${side.length ? "md:grid-cols-3 md:grid-rows-2" : ""}`}>
        <button
          type="button"
          onClick={() => setIndex(0)}
          className={`group relative aspect-[4/3] overflow-hidden rounded-card bg-mist ${side.length ? "md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[480px]" : "md:aspect-[16/9]"}`}
          aria-label={`${title} — 1 / ${images.length}`}
        >
          <Image src={first} alt={title} fill priority sizes="(min-width: 768px) 66vw, 100vw" className="photo-zoom object-cover" />
        </button>
        {side.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIndex(i + 1)}
            className="group relative hidden aspect-[4/3] overflow-hidden rounded-card bg-mist md:block md:aspect-auto"
            aria-label={`${title} — ${i + 2} / ${images.length}`}
          >
            <Image src={src} alt="" fill sizes="33vw" className="photo-zoom object-cover" />
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={() => setIndex(0)} className="btn btn-outline !min-h-9 !px-4 !py-2 !text-[13px]">
          <Images size={15} strokeWidth={1.6} aria-hidden /> {photosLabel}
        </button>
        {note ? <p className="text-[12px] text-pewter">{note}</p> : null}
      </div>
      <Lightbox open={index >= 0} index={index} close={() => setIndex(-1)} slides={images.map((src) => ({ src, alt: title }))} />
    </div>
  );
}
