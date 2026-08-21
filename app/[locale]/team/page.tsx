import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
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
  return pageMetadata(l, "/team", dict.team.metaTitle, dict.team.metaDescription);
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const team = getDictionary(l).team;

  return (
    <>
      <PageHeader title={team.header.title} lede={team.header.lede} />

      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <SectionHeading eyebrow={team.people.eyebrow} title={team.people.title} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {team.people.items.map((person, i) => (
              <Reveal
                key={person.name}
                delay={i * 120}
                className="rounded-3xl border border-shallow/15 bg-deep/40 p-8"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-lagoon to-mid font-display text-xl text-foam">
                  {person.initials}
                </div>
                <h3 className="mt-6 font-display text-2xl tracking-tight">{person.name}</h3>
                <p className="mt-1 text-sm text-foam">{person.affiliation}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-shallow">
                  {person.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-(--ink-muted)">{person.bio}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-12 max-w-3xl border-l-2 border-shallow/40 pl-5 text-sm italic leading-relaxed text-(--ink-muted)">
              {team.acknowledgement}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-deep">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <SectionHeading eyebrow={team.partners.eyebrow} title={team.partners.title} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {team.partners.items.map((partner, i) => (
              <Reveal
                key={partner.name}
                delay={i * 90}
                className="rounded-2xl border border-shallow/15 bg-abyss/60 p-7"
              >
                <h3 className="font-display text-xl tracking-tight">
                  {partner.href ? (
                    <a
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-foam"
                    >
                      {partner.name} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    partner.name
                  )}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-(--ink-muted)">{partner.role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-abyss py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal className="rounded-3xl border border-foam/25 bg-gradient-to-br from-mid/60 to-deep p-10 text-center">
            <h2 className="font-display text-2xl tracking-tight text-foam">
              {team.funding.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-(--ink-muted)">
              {team.funding.body}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
