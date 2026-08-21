import Link from "next/link";
import type { Dictionary } from "@/content/en";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { FinMark, Wordmark } from "@/components/Logo";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const links = [
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/science`, label: dict.nav.science },
    { href: `/${locale}/get-involved`, label: dict.nav.getInvolved },
    { href: `/${locale}/team`, label: dict.nav.team },
    { href: `/${locale}/contact`, label: dict.nav.contact },
    { href: `/${locale}/privacy`, label: dict.privacy.header.title },
  ];
  const otherLocale: Locale = locale === "en" ? "fr" : "en";

  return (
    <footer className="border-t border-shallow/15 bg-abyss">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <FinMark className="h-9 w-9" />
            <Wordmark className="text-xl text-(--ink)" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-(--ink-muted)">
            {dict.footer.blurb}
          </p>
          <p className="mt-4 text-xs italic text-(--ink-muted)/70">{dict.footer.speciesNote}</p>
        </div>

        <nav aria-label={dict.footer.navTitle}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-shallow">
            {dict.footer.navTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-(--ink-muted) transition-colors hover:text-foam"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-shallow">
              {dict.footer.contactTitle}
            </h2>
            <p className="mt-4 text-sm text-(--ink-muted)">{dict.footer.submissions}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 inline-block text-sm font-medium text-foam underline decoration-shallow/40 underline-offset-4 hover:decoration-foam"
            >
              {site.email}
            </a>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-shallow">
              {dict.footer.languageTitle}
            </h2>
            <div className="mt-4 flex gap-3 text-sm">
              <Link
                href="/en"
                hrefLang="en"
                className={locale === "en" ? "text-foam" : "text-(--ink-muted) hover:text-foam"}
              >
                English
              </Link>
              <span className="text-(--ink-muted)/40">·</span>
              <Link
                href="/fr"
                hrefLang="fr"
                className={locale === "fr" ? "text-foam" : "text-(--ink-muted) hover:text-foam"}
              >
                Français
              </Link>
            </div>
            <span className="sr-only">{otherLocale}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-shallow/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-(--ink-muted)/80 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl leading-relaxed">
            <span className="font-semibold text-(--ink-muted)">{dict.footer.fundingTitle}:</span>{" "}
            {dict.footer.funding}
          </p>
          <p>
            © {year} {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
