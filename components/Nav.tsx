"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/content/en";
import type { Locale } from "@/lib/i18n";
import { FinMark, Wordmark } from "@/components/Logo";

export default function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation (state adjustment during render).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherLocale: Locale = locale === "en" ? "fr" : "en";
  const switchedPath = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${otherLocale}`);

  const links = [
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/science`, label: dict.nav.science },
    { href: `/${locale}/get-involved`, label: dict.nav.getInvolved },
    { href: `/${locale}/team`, label: dict.nav.team },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-abyss/85 shadow-[0_1px_0_0_rgba(127,227,212,0.12)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href={`/${locale}`}
          aria-label={dict.nav.homeAria}
          className="flex items-center gap-2.5"
        >
          <FinMark className="h-8 w-8 sm:h-9 sm:w-9" />
          <Wordmark className="text-lg text-(--ink) sm:text-xl" />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-foam ${
                pathname === link.href ? "text-foam" : "text-(--ink-muted)"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={switchedPath}
            hrefLang={otherLocale}
            aria-label={dict.nav.switchLocale}
            className="rounded-full border border-shallow/40 px-3 py-1 text-xs font-medium tracking-widest text-shallow transition-colors hover:border-foam hover:text-foam"
          >
            {dict.nav.switchLocaleShort}
          </Link>
          <Link
            href={`/${locale}/get-involved`}
            className="rounded-full bg-shallow px-4 py-2 text-sm font-semibold text-abyss transition-all hover:bg-foam"
          >
            {dict.nav.submit}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href={switchedPath}
            hrefLang={otherLocale}
            aria-label={dict.nav.switchLocale}
            className="rounded-full border border-shallow/40 px-3 py-1 text-xs font-medium tracking-widest text-shallow"
          >
            {dict.nav.switchLocaleShort}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-shallow/30 text-(--ink)"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-shallow/15 bg-abyss/95 px-5 pb-6 pt-3 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-3 text-base transition-colors ${
                  pathname === link.href ? "text-foam" : "text-(--ink-muted) hover:text-foam"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/get-involved`}
              className="mt-3 rounded-full bg-shallow px-5 py-3 text-center text-base font-semibold text-abyss"
            >
              {dict.nav.submit}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
