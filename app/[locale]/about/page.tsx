import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const dict = getDictionary(l);
  return pageMetadata(l, "/about", dict.about.metaTitle, dict.about.metaDescription);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const about = getDictionary(l).about;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    name: "Fenua FINdex",
    alternateName: about.official.fr,
    url: site.url,
    description: about.metaDescription,
    identifier: "FP-8040",
    funder: {
      "@type": "Organization",
      name: "IUCN BESTLIFE2030 programme, co-funded by the European Union",
      url: site.links.bestlife2030,
    },
    memberOf: {
      "@type": "Organization",
      name: "Physioshark Project",
      url: site.links.physioshark,
    },
  };

  return (
    <>
      <PageHeader title={about.header.title} lede={about.header.lede} />

      <section className="bg-abyss">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 py-20 sm:px-8 md:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <div className="rounded-3xl border border-shallow/20 bg-deep/50 p-8">
              <h2 className="font-display text-2xl tracking-tight text-foam">
                {about.name.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-(--ink-muted)">{about.name.body}</p>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl">
                {about.story.title}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-5">
              {about.story.paragraphs.map((paragraph, i) => (
                <Reveal key={i} delay={i * 100}>
                  <p className="leading-relaxed text-pretty text-(--ink-muted)">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-deep">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-shallow">
              {about.official.title}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="mt-6 max-w-3xl font-display text-2xl leading-snug tracking-tight text-balance sm:text-3xl">
              “{about.official.en}”
            </blockquote>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-3xl font-display text-lg italic leading-snug text-(--ink-muted)">
              «&nbsp;{about.official.fr}&nbsp;»
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-(--ink-muted)">
              {about.official.funding}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <SectionHeading eyebrow={about.milestones.eyebrow} title={about.milestones.title} />
          <ol className="mt-14 grid gap-6 md:grid-cols-5">
            {about.milestones.items.map((item, i) => (
              <Reveal
                key={item.title}
                as="li"
                delay={i * 110}
                className="rounded-2xl border border-shallow/15 bg-deep/40 p-6"
              >
                <p className="font-display text-xl text-foam">{item.label}</p>
                <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-(--ink-muted)">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-abyss pb-28">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-shallow/20 bg-gradient-to-br from-deep to-abyss p-10">
            <h2 className="font-display text-2xl tracking-tight">{about.physioshark.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-(--ink-muted)">
              {about.physioshark.body}
            </p>
            <a
              href={site.links.physioshark}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-shallow transition-colors hover:text-foam"
            >
              {about.physioshark.link}
              <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
          <Reveal
            delay={120}
            className="rounded-3xl border border-shallow/20 bg-gradient-to-br from-deep to-abyss p-10"
          >
            <h2 className="font-display text-2xl tracking-tight">{about.status.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-(--ink-muted)">{about.status.body}</p>
            <Link
              href={`/${l}/get-involved`}
              className="mt-6 inline-block rounded-full bg-shallow px-6 py-3 text-sm font-semibold text-abyss transition-colors hover:bg-foam"
            >
              {about.status.button}
            </Link>
          </Reveal>
        </div>
      </section>

      <JsonLd data={jsonLd} />
    </>
  );
}
