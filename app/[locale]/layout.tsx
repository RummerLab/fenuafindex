import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ScrollProgress from "@/components/ScrollProgress";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return {
    metadataBase: new URL(site.url),
    title: {
      default: dict.meta.defaultTitle,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    applicationName: dict.meta.siteName,
    keywords: [
      "blacktip reef shark",
      "Carcharhinus melanopterus",
      "photo identification",
      "citizen science",
      "shark conservation",
      "French Polynesia",
      "Moorea",
      "digital ecology",
      "AI wildlife monitoring",
    ],
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#04121e",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        description: dict.meta.description,
        logo: `${site.url}/icon.svg`,
        parentOrganization: {
          "@type": "Organization",
          name: "Physioshark Project",
          url: site.links.physioshark,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        inLanguage: ["en", "fr"],
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foam focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-abyss"
        >
          {locale === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <ScrollProgress />
        <Nav locale={locale as Locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={locale as Locale} dict={dict} />
        <JsonLd data={jsonLd} />
        <Analytics />
        <SpeedInsights />
      </body>
      <GoogleAnalytics gaId={site.gaId} />
    </html>
  );
}
