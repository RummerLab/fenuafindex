# Fenua FINdex — fenuafindex.com

Public website for **Fenua FINdex**: a conservation-technology project using digital ecology, AI-assisted photo identification and citizen science to recognise and monitor individual blacktip reef sharks (*Carcharhinus melanopterus*) in French Polynesia.

The project is co-led by researchers at James Cook University (Rummer Lab / [Physioshark](https://physioshark.org)) and IREMP, and supported by the IUCN BESTLIFE2030 programme (project FP-8040), co-funded by the European Union.

## Stack

- **Framework**: Next.js (App Router, TypeScript, Turbopack)
- **Styling**: Tailwind CSS v4 with a custom ocean-depth design system
- **3D / motion**: Three.js shader hero (caustics, god rays, marine snow) + IntersectionObserver scroll reveals — all with `prefers-reduced-motion` fallbacks
- **Fonts**: Fraunces (display) + Inter (body) via `next/font`
- **Deployment**: Vercel

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the root redirects to `/en` or `/fr` based on the browser's language.

## Architecture

```
app/
  [locale]/           # en + fr — all pages are statically generated per locale
    page.tsx          # Home (Three.js hero)
    about/ science/ get-involved/ team/ contact/ privacy/
    opengraph-image.tsx  # per-locale OG image (next/og)
    layout.tsx        # root layout: fonts, nav, footer, JSON-LD
  sitemap.ts robots.ts manifest.ts icon.svg
content/
  en.ts fr.ts         # typed dictionaries — the single source of all copy
components/           # Nav, Footer, OceanScene, Reveal, ...
lib/                  # site config, i18n helpers, SEO metadata helper
proxy.ts              # locale-negotiating redirect for /
public/llms.txt       # llmstxt.org summary for AI crawlers
```

### Localisation

English and French are built in from day one. All copy lives in `content/en.ts` (which defines the `Dictionary` type) and `content/fr.ts` (type-checked against it). Adding Tahitian later means adding `content/ty.ts` and one entry in `lib/i18n.ts`.

### SEO

- Per-page metadata with canonical URLs and `hreflang` alternates (en / fr / x-default)
- `sitemap.xml` with language alternates, `robots.txt`, `llms.txt`, web manifest
- JSON-LD: `Organization` + `WebSite` site-wide, `ResearchProject` on About
- Per-locale Open Graph images rendered with `next/og`

## Content principles

- Only public-safe project information: no internal governance details, no draft agreements, no precise nursery locations.
- Scientific claims trace to published research (dorsal-fin photo-ID validation in *Journal of Fish Biology*; deep-learning shark photo-ID at JCU).
- AI matching is always described as human-validated — uncertain matches are never presented as fact.

## Roadmap (v2+)

- Online sighting submission workflow (photo upload, metadata, consent capture)
- Public shark catalogue with per-individual profiles and aggregated maps
- Researcher validation dashboard behind auth
- API-backed database kept separate from the public site
- News/updates section; Tahitian localisation

## Contact

Shark sightings and enquiries: **photos@fenuafindex.com**

© Fenua FINdex project partners. Code and content all rights reserved unless a licence is added.
