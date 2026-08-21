import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fenua FINdex",
    short_name: "Fenua FINdex",
    description:
      "AI-assisted photo identification and citizen science for blacktip reef shark conservation in French Polynesia.",
    start_url: "/",
    display: "browser",
    background_color: "#04121e",
    theme_color: "#04121e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
