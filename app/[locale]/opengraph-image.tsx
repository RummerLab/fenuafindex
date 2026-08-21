import { ImageResponse } from "next/og";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export const alt = "Fenua FINdex — AI photo-ID and citizen science for blacktip reef sharks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : "en") as Locale;
  const dict = getDictionary(l);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #0d3d54 0%, #072536 45%, #04121e 100%)",
          color: "#eaf6f6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="88" height="88" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#04121e" />
            <path
              d="M17 50 C18.5 33 25.5 21 35.5 16.5 C34.5 25 36.5 36.5 49 50 Z"
              fill="#eaf6f6"
            />
            <path
              d="M13 53.5 C20 51.5 28 52.5 31 53.5 C36 52 43 51.8 51 53.5"
              stroke="#2fb3b0"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 44, letterSpacing: -1 }}>
            Fenua FINdex
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            {l === "fr" ? "Chaque aileron raconte une histoire." : "Every fin tells a story."}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#7fe3d4",
              fontFamily: "sans-serif",
            }}
          >
            {dict.home.hero.eyebrow}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
