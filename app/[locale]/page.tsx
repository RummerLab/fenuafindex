import type { Metadata } from "next";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import OceanScene from "@/components/OceanScene";
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
  return pageMetadata(l, "/", dict.home.metaTitle, dict.home.metaDescription);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const dict = getDictionary(l);
  const home = dict.home;

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative flex min-h-svh items-center overflow-hidden">
        <OceanScene />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-abyss"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-40 sm:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foam/90 sm:text-sm">
              {home.hero.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight text-balance sm:text-7xl lg:text-8xl">
              {home.hero.title}{" "}
              <span className="bg-gradient-to-r from-foam via-shallow to-lagoon bg-clip-text text-transparent italic">
                {home.hero.titleAccent}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-(--ink-muted) sm:text-xl">
              {home.hero.sub}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={`/${l}/get-involved`}
                className="rounded-full bg-shallow px-7 py-3.5 text-base font-semibold text-abyss shadow-[0_0_40px_-8px_rgba(47,179,176,0.7)] transition-all hover:bg-foam hover:shadow-[0_0_50px_-6px_rgba(127,227,212,0.8)]"
              >
                {home.hero.ctaPrimary}
              </Link>
              <Link
                href={`/${l}/science`}
                className="rounded-full border border-shallow/40 px-7 py-3.5 text-base font-medium text-(--ink) transition-colors hover:border-foam hover:text-foam"
              >
                {home.hero.ctaSecondary}
              </Link>
            </div>
          </Reveal>
        </div>
        {/* A plain anchor so it scrolls smoothly without JS, stays keyboard
            reachable, and follows the reduced-motion rule already in globals. */}
        <a
          href="#explore"
          className="group absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] text-(--ink-muted)/70 transition-colors hover:text-foam"
        >
          <span className="flex flex-col items-center gap-2">
            {home.hero.scrollHint}
            <svg
              viewBox="0 0 12 20"
              aria-hidden="true"
              className="dive-arrow h-5 w-3 transition-transform group-hover:translate-y-1"
              fill="none"
            >
              <path
                d="M6 2v14m0 0 4-4m-4 4-4-4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </section>

      {/* ---- Stats ---- */}
      <section id="explore" className="relative scroll-mt-20 bg-abyss">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:grid-cols-3 sm:px-8 sm:py-24">
          {home.stats.map((stat, i) => (
            <Reveal key={stat.value} delay={i * 120} className="text-center sm:text-left">
              <CountUp
                value={stat.value}
                className="block font-display text-6xl tracking-tight text-foam sm:text-7xl"
              />
              <p className="mt-3 text-sm leading-relaxed text-(--ink-muted)">{stat.label}</p>
            </Reveal>
          ))}
        </div>
        <div className="hairline mx-auto max-w-6xl" />
      </section>

      {/* ---- Mission ---- */}
      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-shallow">
              {home.mission.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-4xl font-display text-3xl leading-snug tracking-tight text-balance sm:text-5xl">
              {home.mission.statement}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-pretty text-(--ink-muted) sm:text-lg">
              {home.mission.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- Pillars ---- */}
      <section className="relative overflow-hidden bg-deep">
        <div
          aria-hidden="true"
          className="drift pointer-events-none absolute -top-40 right-[-10%] h-96 w-[60%] rounded-[100%] bg-lagoon/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading eyebrow={home.pillars.eyebrow} title={home.pillars.title} />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {home.pillars.items.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 140}
                className="lift rounded-3xl border border-shallow/15 bg-abyss/50 p-8 backdrop-blur-sm hover:border-shallow/40"
              >
                <p className="font-display text-4xl text-shallow/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 font-display text-2xl tracking-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-(--ink-muted)">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading eyebrow={home.how.eyebrow} title={home.how.title} />
          <ol className="mt-16 space-y-0">
            {home.how.steps.map((step, i) => (
              <Reveal
                key={step.title}
                as="li"
                delay={i * 80}
                className="line-draw group grid gap-4 py-8 pl-8 sm:grid-cols-[6rem_1fr] sm:gap-10 sm:pl-12"
              >
                <p className="relative font-display text-3xl text-shallow/70 transition-colors group-hover:text-foam sm:text-4xl">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.57rem] top-2.5 h-3 w-3 rounded-full border-2 border-shallow bg-abyss transition-colors group-hover:bg-foam sm:-left-[3.57rem]"
                  />
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-xl tracking-tight sm:text-2xl">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-(--ink-muted) sm:text-base">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={120} className="mt-10 pl-8 sm:pl-12">
            <Link
              href={`/${l}/science`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-shallow transition-colors hover:text-foam"
            >
              {home.how.link}
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Science ---- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep via-mid to-deep">
        <div
          aria-hidden="true"
          className="drift pointer-events-none absolute -bottom-32 left-[-15%] h-96 w-[70%] rounded-[100%] bg-shallow/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <SectionHeading eyebrow={home.science.eyebrow} title={home.science.title} align="center" />
          <Reveal delay={160}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-pretty text-(--ink-muted) sm:text-lg">
              {home.science.body}
            </p>
          </Reveal>
          <Reveal delay={280}>
            <Link
              href={`/${l}/science`}
              className="mt-10 inline-block rounded-full border border-shallow/40 px-7 py-3.5 text-base font-medium transition-colors hover:border-foam hover:text-foam"
            >
              {home.science.link}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Citizen-science CTA ---- */}
      <section className="bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="rounded-[2.5rem] border border-shallow/20 bg-gradient-to-br from-deep to-abyss p-10 sm:p-16">
            <SectionHeading eyebrow={home.cta.eyebrow} title={home.cta.title} />
            <Reveal delay={140}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-(--ink-muted) sm:text-lg">
                {home.cta.body}
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href={`/${l}/get-involved`}
                  className="rounded-full bg-shallow px-7 py-3.5 text-base font-semibold text-abyss transition-colors hover:bg-foam"
                >
                  {home.cta.button}
                </Link>
                <p className="text-sm text-(--ink-muted)">
                  {home.cta.emailLabel}{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="font-medium text-foam underline decoration-shallow/40 underline-offset-4 hover:decoration-foam"
                  >
                    {site.email}
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Partners ---- */}
      <section className="bg-abyss pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading eyebrow={home.partners.eyebrow} title={home.partners.title} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {home.partners.items.map((partner, i) => (
              <Reveal
                key={partner.name}
                delay={i * 90}
                className="lift rounded-2xl border border-shallow/15 bg-deep/50 px-6 py-5 hover:border-shallow/40"
              >
                <p className="font-display text-lg tracking-tight">{partner.name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-(--ink-muted)">{partner.role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
