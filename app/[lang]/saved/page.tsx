import { notFound } from "next/navigation";
import SavedList from "@/components/SavedList";
import ListingCard from "@/components/ListingCard";
import { PhotoHero } from "@/components/ui";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getListings } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/[lang]/saved">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.saved.metaTitle, robots: { index: false, follow: true } };
}

export default async function SavedPage({ params }: PageProps<"/[lang]/saved">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const listings = await getListings();

  // Cards are rendered on the server; the client list only chooses which to show.
  const cards = listings.map((l) => ({
    slug: l.slug,
    title: l.title,
    url: `${SITE_URL}/${lang}/listings/${l.slug}`,
    node: <ListingCard listing={l} lang={lang} t={t} />,
  }));

  return (
    <>
      <PhotoHero image="/media/photos/interior-lounge.jpg" title={t.saved.heading} />
      <section className="wrap section-gap">
        <SavedList cards={cards} t={t.saved} />
      </section>
    </>
  );
}
