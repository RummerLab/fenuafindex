import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const dict = getDictionary(l);
  return pageMetadata(l, "/privacy", dict.privacy.metaTitle, dict.privacy.metaDescription);
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const privacy = getDictionary(l).privacy;

  return (
    <>
      <PageHeader title={privacy.header.title} lede={privacy.header.lede} />

      <section className="bg-abyss pb-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <p className="rounded-2xl border border-shallow/25 bg-deep/50 px-6 py-4 text-sm text-(--ink-muted)">
              {privacy.updated}
            </p>
          </Reveal>
          <div className="mt-12 space-y-12">
            {privacy.sections.map((section, i) => (
              <Reveal key={section.title} delay={Math.min(i * 60, 180)}>
                <h2 className="font-display text-2xl tracking-tight text-foam">
                  {section.title}
                </h2>
                <p className="mt-3 leading-relaxed text-pretty text-(--ink-muted)">
                  {section.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
