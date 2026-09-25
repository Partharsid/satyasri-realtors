import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { PhotoHero } from "@/components/ui";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getPosts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import PageTransition from "@/components/motion/PageTransition";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMeta(lang, "/blog", t.blog.metaTitle, t.blog.metaDescription, "/media/photos/service-signing.jpg");
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const posts = await getPosts();

  return (
    <PageTransition>
      <PhotoHero image="/media/photos/service-signing.jpg" label={t.blog.label} title={t.blog.heading} />
      <section className="section-gap">
        <div className="wrap">
          {lang !== "en" ? <p className="mb-8 text-[14px] text-pewter">{t.blog.englishOnly}</p> : null}
          {posts.length ? (
            <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} lang={lang} minRead={t.blog.minRead} />
              ))}
            </div>
          ) : (
            <p className="text-pewter">{t.blog.empty}</p>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
