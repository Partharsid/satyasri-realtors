import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { ArrowLeft, Phone } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { PhotoHero, SectionHeading } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { fill, getDictionary, href, isLocale, LOCALES } from "@/lib/i18n";
import { getPost, getPosts } from "@/lib/data";
import { readingMinutes } from "@/lib/format";
import { SITE, SITE_URL } from "@/lib/site";
import { jsonLd, pageMeta } from "@/lib/seo";

export const revalidate = 600;

export async function generateStaticParams() {
  const posts = await getPosts();
  return LOCALES.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const p = await getPost(slug);
  if (!p) return {};
  const meta = pageMeta(lang, `/blog/${slug}`, p.title, p.excerpt ?? "", p.cover ?? undefined);
  // Articles are written in English — point every locale's canonical at the English page.
  return { ...meta, alternates: { canonical: `${SITE_URL}/en/blog/${slug}` }, openGraph: { ...meta.openGraph, type: "article", publishedTime: p.published_at ?? undefined } };
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const [post, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  const more = all.filter((p) => p.slug !== slug).slice(0, 3);
  const date = post.published_at ? new Date(post.published_at) : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    inLanguage: "en-IN",
    author: { "@type": "Organization", name: SITE.name, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#business` },
    mainEntityOfPage: `${SITE_URL}/en/blog/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleLd)} />
      <PhotoHero image={post.cover ?? "/media/photos/service-signing.jpg"} label={t.blog.label} title={post.title} compact>
        <p className="text-[14px]">
          {date ? <time dateTime={date.toISOString()}>{date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time> : null}
          {" · "}
          {fill(t.blog.minRead, { n: readingMinutes(post.content) })}
        </p>
      </PhotoHero>

      <article className="wrap pb-20 pt-10 md:pt-14" lang="en">
        <Link href={href(lang, "/blog")} className="arrow-link mb-10 text-[14px] text-pewter hover:text-ink">
          <ArrowLeft size={15} strokeWidth={1.5} aria-hidden /> {t.blog.back}
        </Link>
        {lang !== "en" ? <p className="mb-6 text-[14px] text-pewter" lang={lang}>{t.blog.englishOnly}</p> : null}
        <div className="mx-auto max-w-[680px]">
          {post.excerpt ? <p className="mb-10 text-[20px] font-light leading-relaxed">{post.excerpt}</p> : null}
          <div className="prose-gallery">
            <Markdown>{post.content}</Markdown>
          </div>
          <div className="hairline mt-14 flex flex-wrap gap-2 pt-8">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsAppIcon size={17} /> {t.cta.whatsapp}
            </a>
            <a href={SITE.phoneHref} className="btn btn-dark">
              <Phone size={15} strokeWidth={1.6} aria-hidden /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </article>

      {more.length ? (
        <section className="border-t border-mist bg-mist-soft section-gap">
          <div className="wrap">
            <SectionHeading label={t.blog.label} title={t.home.journalHeading} size="md" className="mb-10" />
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} post={p} lang={lang} minRead={t.blog.minRead} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
