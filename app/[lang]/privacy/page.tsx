import { notFound } from "next/navigation";
import { PhotoHero } from "@/components/ui";
import { getDictionary, isLocale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import PageTransition from "@/components/motion/PageTransition";

const TITLE = "Privacy Policy";
const DESCRIPTION = "How SatyaSri Realtors collects, uses and protects the details you share when you enquire about a property.";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/privacy", TITLE, DESCRIPTION, "/media/photos/service-consult.jpg");
}

const SECTIONS: { h: string; p: string }[] = [
  { h: "What we collect", p: "When you send an enquiry we collect the details you type into the form: your name, mobile number, what you want to do (buy, sell, rent, lease or invest), preferred location, budget, email (optional) and any message. If you message us on WhatsApp or call, we see the number you use." },
  { h: "How we use it", p: "Only to respond to your enquiry, shortlist properties and arrange site visits. Your enquiry is stored securely and shared with our team by message, email and spreadsheet so that someone can call you back." },
  { h: "What we do not do", p: "We do not sell your details, and we do not share them with other agents, advertisers or lenders without asking you first." },
  { h: "Cookies and analytics", p: "The site remembers your language choice in a small cookie. We use privacy-friendly visitor statistics that do not use advertising cookies or track you across other websites." },
  { h: "Keeping and deleting your data", p: "We keep enquiry details only as long as they are useful for helping you. To see, correct or delete your details, call or WhatsApp us and we will do it." },
  { h: "Contact", p: `${SITE.name}, ${SITE.address.full}. Phone and WhatsApp ${SITE.phoneDisplay}.` },
];

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <PageTransition>
      <PhotoHero image="/media/photos/service-consult.jpg" label={t.footer.explore} title={TITLE}>
        <p>{DESCRIPTION}</p>
      </PhotoHero>
      <section className="section-gap">
        <div className="wrap max-w-[760px]">
          {SECTIONS.map((s) => (
            <div key={s.h} className="hairline py-6">
              <h2 className="heading mb-2 text-[22px]">{s.h}</h2>
              <p className="text-[17px] leading-relaxed text-[#1a1a1a]">{s.p}</p>
            </div>
          ))}
          <p className="mt-8 text-[13px] text-pewter">Last updated 24 November 2026.</p>
        </div>
      </section>
    </PageTransition>
  );
}
