import type { Metadata } from "next";
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
  return pageMetadata(
    l,
    "/get-involved",
    dict.getInvolved.metaTitle,
    dict.getInvolved.metaDescription,
  );
}

export default async function GetInvolvedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const page = getDictionary(l).getInvolved;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(page.checklist.emailSubject)}`;

  return (
    <>
      <PageHeader title={page.header.title} lede={page.header.lede} />

      {/* Interim email workflow */}
      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <Reveal className="rounded-[2.5rem] border border-foam/25 bg-gradient-to-br from-mid/70 to-deep p-10 sm:p-14">
            <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl">
              {page.interim.title}
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-pretty text-(--ink-muted)">
              {page.interim.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={mailto}
                className="rounded-full bg-shallow px-7 py-3.5 text-base font-semibold text-abyss transition-colors hover:bg-foam"
              >
                {page.interim.button}
              </a>
              <p className="font-mono text-sm text-foam">{page.interim.emailNote}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Photo guide */}
      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <SectionHeading eyebrow={page.photoGuide.eyebrow} title={page.photoGuide.title} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.photoGuide.items.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="rounded-2xl border border-shallow/15 bg-deep/40 p-7"
              >
                <p className="font-display text-2xl text-shallow/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl tracking-tight">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-(--ink-muted)">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist + consent */}
      <section className="bg-deep">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow={page.checklist.eyebrow} title={page.checklist.title} />
            <ul className="mt-8 space-y-3.5">
              {page.checklist.items.map((item, i) => (
                <Reveal
                  key={i}
                  as="li"
                  delay={i * 80}
                  className="flex items-start gap-3 text-sm leading-relaxed text-(--ink-muted)"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="mt-0.5 h-4 w-4 shrink-0 text-shallow"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5 6.5 12 13 4.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </Reveal>
              ))}
            </ul>
            <Reveal delay={200}>
              <a
                href={mailto}
                className="mt-9 inline-block rounded-full bg-shallow px-6 py-3 text-sm font-semibold text-abyss transition-colors hover:bg-foam"
              >
                {page.checklist.emailCta}
              </a>
            </Reveal>
          </div>
          <Reveal delay={150} className="self-start rounded-3xl border border-shallow/20 bg-abyss/60 p-9">
            <h2 className="font-display text-2xl tracking-tight text-foam">{page.consent.title}</h2>
            <ul className="mt-5 space-y-3.5">
              {page.consent.items.map((item, i) => (
                <li
                  key={i}
                  className="border-l-2 border-shallow/40 pl-4 text-sm leading-relaxed text-(--ink-muted)"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-abyss py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl">
              {page.future.title}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-pretty text-(--ink-muted)">
              {page.future.body}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
