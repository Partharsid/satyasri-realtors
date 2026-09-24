import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/** Aker section opener: small grey label above a whisper-weight heading. */
export function SectionHeading({
  label,
  title,
  children,
  tone = "dark",
  size = "lg",
  className = "",
}: {
  label?: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: "dark" | "light";
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {label ? <span className={`label mb-3 ${tone === "light" ? "!text-mist/80" : ""}`}>{label}</span> : null}
      <h2 className={`${size === "lg" ? "heading-lg" : "heading"} ${tone === "light" ? "text-paper" : "text-ink"}`}>{title}</h2>
      {children ? <div className={`mt-5 max-w-[600px] ${tone === "light" ? "text-mist/85" : "text-pewter"}`}>{children}</div> : null}
    </div>
  );
}

/** Ghost text + arrow link — the system's default action. */
export function ArrowLink({ href, children, tone = "dark", external = false }: { href: string; children: ReactNode; tone?: "dark" | "light"; external?: boolean }) {
  const cls = `arrow-link ${tone === "light" ? "text-paper hover:text-mist" : "text-ink hover:text-brand-deep"}`;
  const inner = (
    <>
      <span className="border-b border-current/30 pb-0.5">{children}</span>
      <ArrowRight size={16} strokeWidth={1.4} aria-hidden />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

/** Full-bleed photo band used as every page's opener. */
export function PhotoHero({
  image,
  label,
  title,
  children,
  priority = true,
  tall = false,
  compact = false,
}: {
  image: string;
  label?: string;
  title: ReactNode;
  children?: ReactNode;
  priority?: boolean;
  tall?: boolean;
  /** Smaller title for long headings such as property names. */
  compact?: boolean;
}) {
  return (
    <section className={`relative isolate flex items-end overflow-hidden bg-midnight text-paper ${tall ? "min-h-[82svh]" : "min-h-[58svh] md:min-h-[64svh]"}`}>
      <Image src={image} alt="" fill priority={priority} sizes="100vw" className="-z-20 object-cover opacity-80 saturate-[.85]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/45" />
      <div className="wrap pb-12 pt-32 md:pb-16">
        {label ? <span className="label mb-4 !text-mist/85">{label}</span> : null}
        <h1 className={`${compact ? "heading-lg max-w-5xl" : "heading-xl max-w-4xl"} text-balance`}>{title}</h1>
        {children ? <div className="mt-6 max-w-[600px] text-[16px] text-mist/90">{children}</div> : null}
      </div>
    </section>
  );
}

/** Numbered row: "01  Invest" with a hairline above. */
export function NumberedRow({ n, title, children }: { n: number; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="hairline grid grid-cols-[48px_1fr] gap-x-4 py-6 md:grid-cols-[80px_minmax(0,1fr)_minmax(0,1.3fr)] md:gap-x-8">
      <span className="pt-1 text-[12px] text-pewter tabular-nums">{String(n).padStart(2, "0")}</span>
      <h3 className="text-[20px] font-normal leading-snug md:text-[22px]">{title}</h3>
      {children ? <div className="col-start-2 mt-2 text-pewter md:col-start-3 md:mt-0">{children}</div> : null}
    </div>
  );
}
