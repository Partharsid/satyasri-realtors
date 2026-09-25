import type { Review } from "@/lib/data";
import { GoogleIcon, Stars } from "./icons";

export function ReviewCard({ review: r }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-card bg-paper p-6">
      <div className="flex items-center justify-between">
        <Stars rating={r.rating} />
        <GoogleIcon size={16} />
      </div>
      <blockquote className="mt-4 flex-1 font-serif text-[16px] leading-relaxed text-[#1a1a1a]">“{r.body}”</blockquote>
      <figcaption className="hairline mt-6 flex items-center justify-between pt-4 text-[13px]">
        <span className="font-medium">{r.author}</span>
        {r.year ? <span className="text-pewter">{r.year}</span> : null}
      </figcaption>
    </figure>
  );
}

/** Horizontal, scroll-snapping rail that bleeds to the viewport edge. */
export function ReviewsRail({ reviews }: { reviews: Review[] }) {
  return (
    <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin]" tabIndex={0} role="region" aria-label="Google reviews">
      <ul data-reveal="stagger" className="flex snap-x snap-mandatory gap-3 px-4 pb-4 md:px-[max(32px,calc((100vw-1200px)/2+32px))]">
        {reviews.map((r) => (
          <li key={r.id} className="w-[85vw] max-w-[380px] shrink-0 snap-start">
            <ReviewCard review={r} />
          </li>
        ))}
      </ul>
    </div>
  );
}
