import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

// Builds per-page metadata with canonical + hreflang alternates.
// Relative URLs resolve against metadataBase set in the locale layout.
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  const p = path === "/" ? "" : path;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${p}`,
      languages: {
        en: `/en${p}`,
        fr: `/fr${p}`,
        "x-default": `/en${p}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${p}`,
      siteName: site.name,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? "en_US" : "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
