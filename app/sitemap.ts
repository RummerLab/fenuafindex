import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = ["", "/about", "/science", "/get-involved", "/team", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${site.url}/en${route}`,
    lastModified,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "/get-involved" ? 0.9 : 0.7,
    alternates: {
      languages: {
        en: `${site.url}/en${route}`,
        fr: `${site.url}/fr${route}`,
      },
    },
  }));
}
