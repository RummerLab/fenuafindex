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
  return pageMetadata(l, "/science", dict.science.metaTitle, dict.science.metaDescription);
}

export default async function SciencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const science = getDictionary(l).science;

  return (
    <>
      <PageHeader title={science.header.title} lede={science.header.lede} />

      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <SectionHeading eyebrow={science.barcode.eyebrow} title={science.barcode.title} />
          <div className="mt-8 grid gap-12 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5">
              {science.barcode.paragraphs.map((paragraph, i) => (
                <Reveal key={i} delay={i * 100}>
                  <p className="leading-relaxed text-pretty text-(--ink-muted)">{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <div className="space-y-4">
              {science.barcode.facts.map((fact, i) => (
                <Reveal
                  key={fact.value}
                  delay={i * 120}
                  className="rounded-2xl border border-shallow/20 bg-deep/50 px-6 py-5"
                >
                  <p className="font-display text-3xl tracking-tight text-foam">{fact.value}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-(--ink-muted)">{fact.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-deep">
        <div
          aria-hidden="true"
          className="drift pointer-events-none absolute -top-32 right-[-10%] h-80 w-[55%] rounded-[100%] bg-lagoon/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <SectionHeading eyebrow={science.asymmetry.eyebrow} title={science.asymmetry.title} />
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {science.asymmetry.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 120}>
                <p className="leading-relaxed text-pretty text-(--ink-muted)">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          {/* Mirrored fins: same shark, two patterns */}
          <Reveal delay={200} className="mt-14 flex items-end justify-center gap-10 sm:gap-20">
            {[false, true].map((mirrored) => (
              <svg
                key={mirrored ? "right" : "left"}
                viewBox="0 0 120 90"
                className={`h-24 w-auto sm:h-32 ${mirrored ? "-scale-x-100" : ""}`}
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14 84 C18 46 34 20 62 10 C58 30 64 58 106 84 Z"
                  fill="#0d3d54"
                  stroke="#2fb3b0"
                  strokeWidth="1.5"
                />
                <path
                  d="M50 16 C54 13 58 11 62 10 C61 15 60.5 20 61 25 C57 24 52.5 21 50 16 Z"
                  fill="#04121e"
                />
                {(mirrored ? [30, 44, 58] : [34, 50, 62]).map((x, i) => (
                  <circle
                    key={x}
                    cx={x}
                    cy={mirrored ? 44 + i * 9 : 40 + i * 11}
                    r={mirrored ? 2.6 : 3.4}
                    fill="#7fe3d4"
                    opacity="0.75"
                  />
                ))}
              </svg>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <SectionHeading eyebrow={science.ai.eyebrow} title={science.ai.title} />
          <div className="mt-8 max-w-3xl space-y-5">
            {science.ai.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className="leading-relaxed text-pretty text-(--ink-muted)">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {science.ai.steps.map((step, i) => (
              <Reveal
                key={step.title}
                delay={i * 130}
                className="rounded-2xl border border-shallow/20 bg-deep/40 p-7"
              >
                <p className="font-display text-3xl text-shallow/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-xl tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-(--ink-muted)">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-deep">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <SectionHeading eyebrow={science.data.eyebrow} title={science.data.title} />
          <div className="mt-8 max-w-3xl space-y-5">
            {science.data.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className="leading-relaxed text-pretty text-(--ink-muted)">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-abyss pb-28 pt-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="rounded-3xl border border-shallow/20 bg-deep/40 p-10">
            <h2 className="font-display text-2xl tracking-tight">{science.references.title}</h2>
            <p className="mt-3 text-sm text-(--ink-muted)">{science.references.intro}</p>
            <ul className="mt-6 space-y-4">
              {science.references.items.map((reference, i) => (
                <li
                  key={i}
                  className="border-l-2 border-shallow/40 pl-5 text-sm leading-relaxed text-(--ink-muted)"
                >
                  {reference}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
