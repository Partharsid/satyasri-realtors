import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/data";
import { fill, href, type Locale } from "@/lib/i18n/config";
import { readingMinutes } from "@/lib/format";

export function PostCard({ post: p, lang, minRead }: { post: BlogPost; lang: Locale; minRead: string }) {
  const date = p.published_at ? new Date(p.published_at) : null;
  return (
    <article className="group relative">
      <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-mist">
        {p.cover ? <Image src={p.cover} alt="" fill sizes="(min-width:768px) 380px, 100vw" className="photo-zoom object-cover" /> : null}
      </div>
      <p className="mt-4 text-[12px] text-pewter">
        {date ? (
          <time dateTime={date.toISOString()}>{date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
        ) : null}
        {" · "}
        {fill(minRead, { n: readingMinutes(p.content) })}
      </p>
      <h3 className="mt-2 text-[20px] font-light leading-snug">
        <Link href={href(lang, `/blog/${p.slug}`)} className="after:absolute after:inset-0 after:content-['']">
          {p.title}
        </Link>
      </h3>
      {p.excerpt ? <p className="mt-2 line-clamp-3 text-[14px] text-pewter">{p.excerpt}</p> : null}
    </article>
  );
}
