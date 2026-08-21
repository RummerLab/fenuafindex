import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
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
  return pageMetadata(l, "/contact", dict.contact.metaTitle, dict.contact.metaDescription);
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const contact = getDictionary(l).contact;

  return (
    <>
      <PageHeader title={contact.header.title} lede={contact.header.lede} />

      <section className="bg-abyss pb-28">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 md:grid-cols-2">
          <Reveal className="rounded-[2.5rem] border border-foam/25 bg-gradient-to-br from-mid/70 to-deep p-10 sm:p-12">
            <h2 className="font-display text-3xl tracking-tight">{contact.email.title}</h2>
            <p className="mt-4 leading-relaxed text-(--ink-muted)">{contact.email.body}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-7 inline-block rounded-full bg-shallow px-7 py-3.5 font-mono text-base font-semibold text-abyss transition-colors hover:bg-foam"
            >
              {site.email}
            </a>
            <p className="mt-6 text-xs leading-relaxed text-(--ink-muted)/80">
              {contact.email.note}
            </p>
          </Reveal>

          <div className="flex flex-col gap-8">
            <Reveal delay={120} className="rounded-3xl border border-shallow/20 bg-deep/40 p-9">
              <h2 className="font-display text-2xl tracking-tight">{contact.sighting.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-(--ink-muted)">
                {contact.sighting.body}
              </p>
              <Link
                href={`/${l}/get-involved`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-shallow transition-colors hover:text-foam"
              >
                {contact.sighting.button}
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>

            <Reveal delay={220} className="rounded-3xl border border-shallow/20 bg-deep/40 p-9">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-shallow">
                {contact.partnersTitle}
              </h2>
              <ul className="mt-5 space-y-3">
                {contact.partners.map((partner) => (
                  <li key={partner.name}>
                    <a
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-(--ink-muted) underline decoration-shallow/40 underline-offset-4 transition-colors hover:text-foam hover:decoration-foam"
                    >
                      {partner.name} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
