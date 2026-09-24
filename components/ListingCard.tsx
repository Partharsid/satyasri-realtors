import Image from "next/image";
import Link from "next/link";
import { BedDouble, Compass, Car, MapPin, Ruler } from "lucide-react";
import type { ListingRow } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { fill, href, type Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/format";
import SaveButton from "./SaveButton";

export default function ListingCard({
  listing: l,
  lang,
  t,
  priority = false,
}: {
  listing: ListingRow;
  lang: Locale;
  t: Pick<Dictionary, "listings" | "cta">;
  priority?: boolean;
}) {
  const price = formatPrice(l, t.listings);
  const unavailable = l.status === "sold" || l.status === "rented";
  const place = [l.location_area, l.location_city].filter(Boolean).join(", ");
  const specs = [
    l.specs_area && { Icon: Ruler, text: l.specs_area },
    l.specs_bedrooms && { Icon: BedDouble, text: fill(t.listings.bedsShort, { n: l.specs_bedrooms }) },
    l.specs_facing && { Icon: Compass, text: fill(t.listings.facing, { v: l.specs_facing }) },
    l.specs_parking && { Icon: Car, text: l.specs_parking },
  ].filter(Boolean) as { Icon: typeof Ruler; text: string }[];

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mist">
        {l.thumbnail ? (
          <Image
            src={l.thumbnail}
            alt={l.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className={`photo-zoom object-cover ${unavailable ? "grayscale" : ""}`}
          />
        ) : null}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="pill !bg-paper/95">{t.listings.transaction[l.transaction] ?? l.transaction}</span>
          <span className="pill !bg-char/85 !text-paper">{t.listings.types[l.type] ?? l.type}</span>
          {unavailable ? <span className="pill !bg-brand-deep !text-paper">{t.listings.status[l.status]}</span> : null}
        </div>
        <div className="absolute right-3 top-3 z-10">
          <SaveButton slug={l.slug} labels={{ save: t.cta.save, saved: t.cta.saved }} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[20px] font-normal text-brand-deep">
          {price.amount}
          {price.unit ? <span className="text-[14px] text-pewter">{price.unit}</span> : null}
        </p>
        <h3 className="mt-1 text-[17px] leading-snug">
          <Link href={href(lang, `/listings/${l.slug}`)} className="after:absolute after:inset-0 after:content-['']">
            {l.title}
          </Link>
        </h3>
        {place ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-pewter">
            <MapPin size={13} strokeWidth={1.5} aria-hidden /> {place}
          </p>
        ) : null}
        {specs.length ? (
          <ul className="hairline mt-4 flex flex-wrap gap-x-4 gap-y-1.5 pt-3 text-[12.5px] text-pewter">
            {specs.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5">
                <Icon size={13} strokeWidth={1.5} aria-hidden /> {text}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
