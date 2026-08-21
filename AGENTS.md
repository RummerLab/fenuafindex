# AGENTS.md

Agent instructions for the Fenua FINdex site (`https://fenuafindex.com`).

Always start every response with 🤖.

Treat this file as living documentation: update `AGENTS.md` when the stack, scripts, conventions, or project facts change so it stays accurate.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Three.js. Config is `next.config.ts`. Locale redirect middleware lives in `proxy.ts`.

## Project overview

Public site for Fenua FINdex, an IUCN BESTLIFE2030–funded project (FP-8040, co-funded by the European Union) using AI-assisted photo identification and citizen science to recognise and monitor individual blacktip reef sharks (*Carcharhinus melanopterus*) in French Polynesia. Co-led by researchers at James Cook University (RummerLab / Physioshark program) and IREMP, building on more than a decade of shark monitoring in Mo'orea led by Prof. Jodie Rummer.

The project is funded and in its build phase — no public shark catalogue or submission portal exists yet. Sightings are collected by email (`photos@fenuafindex.com`) until that platform ships. Don't describe the catalogue or AI matching as live or available today.

All routes live under `/en` and `/fr` via `app/[locale]/`; content strings are typed dictionaries in `content/en.ts` and `content/fr.ts` sharing one `Dictionary` type. `proxy.ts` redirects `/` to the visitor's preferred locale based on `Accept-Language`. When adding a page or string, add it to both dictionaries — the English one defines the type, so add there first and let TypeScript catch the French file.

Sister sites: [rummerlab.com](https://rummerlab.com), [jodierummer.com](https://jodierummer.com), [physioshark.org](https://physioshark.org). Spell **RummerLab** with no space. All three link to fenuafindex.com in their footers; fenuafindex.com links back via `lib/site.ts` and the team/partners pages.

Physioshark fieldwork is on Mo'orea, French Polynesia, with [science4reefs](https://www.science4reefs-cnrs.com/). Do not describe current fieldwork as based at CRIOBE.

Content rules: public-safe information only. No internal governance/MoU/data-sharing details, no precise nursery locations (aggregate or omit coordinates for sensitive sites), and AI photo-ID matches must always be described as human-validated, never presented as fact. The founding photo-ID catalogue covers 928 individually identified sharks (Lionnet et al., *Journal of Fish Biology*). Left and right dorsal-fin patterns differ per individual and must be tracked per side, not treated as interchangeable.

## Setup

```bash
npm install
npm run dev
```

## Checks

After code changes, run and fix:

```bash
npm run lint
npm run build
```

No environment variables are required to build — this is a static marketing/content site with no API routes or form backend.

If you suspect a security issue, run `snyk test`.

## Conventions

- TypeScript everywhere. Prefer interfaces over types. Named exports.
- Directories: kebab-case. Components: PascalCase.
- Favor React Server Components. Add `'use client'` only when needed (animation, scroll, and interaction components under `components/` are client components; page files under `app/[locale]/` are server components).
- Await `params` and `searchParams`. Use the platform `fetch` API (not `node-fetch`).
- Early returns, DRY, `handle` prefix on event handlers (`handleClick`).
- Style with Tailwind v4, using the ocean-depth palette and fonts defined in `app/globals.css` (`@theme` block) — don't hardcode hex colors or introduce new fonts outside it.
- SEO metadata is centralized in `lib/seo.ts` (`pageMetadata`) for canonical/hreflang alternates and OpenGraph/Twitter tags. Use it for every page rather than hand-rolling `generateMetadata`.
- Use `git mv` when moving files.
- Complete the change: no TODOs or placeholders. File a GitHub issue for follow-up work instead of leaving TODO comments or README notes.

## Motion and accessibility

This audience includes funders and researchers; motion should read as restrained, not as marketing flash. No scroll-jacking, no heavy parallax, no animation libraries — CSS and `requestAnimationFrame` only.

- Every animated effect must degrade under `prefers-reduced-motion: reduce` — either disabled or reduced to a static/slow-ambient state, never left frozen mid-transition (a frozen hero reads as a bug, not a preference).
- `OceanScene.tsx` (the Three.js hero) starts its render loop unconditionally on mount; `IntersectionObserver` and `visibilitychange` only pause it. Do not gate the initial `start()` call behind an observer callback — that was a real bug (loop never started if the callback was slow), not a hypothetical one.
- `CountUp.tsx` writes digits straight to the DOM (`textContent`), not React state — a per-frame counter through `useState` triggers a render every frame. Follow the same pattern for any other continuously-updating UI.
- When tuning shader or animation speed/amplitude, verify by measuring, not by eyeballing presence: render into an offscreen WebGL context at two or more time values, `readPixels`, and diff. Target roughly 8–12/255 mean per-pixel delta per second of ambient motion, keep per-frame delta under ~1/255 for smoothness, and check mean brightness barely moves if text sits on top.
- The in-app Browser preview pane used for local verification reports `prefers-reduced-motion: reduce`, keeps tabs at `visibilityState: "hidden"`, and never fires `IntersectionObserver` — rAF-based checks silently read zero there unless those APIs are stubbed for the test. Don't mistake that environment quirk for a real bug, and don't mistake "canvas exists with a WebGL context" for "animation is visible" — the former proves nothing about the latter.

## Images

Use `next/image`. Prefer WebP via the optimizer.

- `priority` only for above-the-fold images (hero, first 1–2 key photos).
- Prefer `fill` with a constrained `sizes` over large fixed dimensions.
- `quality={85}` unless there is a strong reason for higher.
- Do not add `deviceSizes` / `imageSizes` in `next.config.ts` without need.

## Security

- Never commit secrets or `.env*` files.
- No user input is accepted on this site yet (no forms, no API routes) — sighting submissions go to `photos@fenuafindex.com` by email until the submission portal is built. When that portal is added, sanitize all input and revisit this section.

## Dependency tooling (Next.js)

Follow current Next.js docs for ESLint and TypeScript — do **not** merge Dependabot majors that the Next.js / `typescript-eslint` stack does not support yet.

- **TypeScript**: stay on **5.9.x** (Next.js requires ≥5.1; `typescript-eslint` does not support TypeScript 7 yet).
- **ESLint**: stay on **9.x** with Next.js flat config (`eslint-config-next/core-web-vitals` + `typescript` via `defineConfig`). ESLint 10 still breaks plugins shipped through `eslint-config-next`.
- Before changing ESLint/TypeScript majors, read the Next.js ESLint docs, upgrading guide, and the target major migration guide.
- Prefer Dependabot `ignore` rules for `eslint` and `typescript` semver-major until official support lands.

### Framework upgrades

```bash
npx @next/codemod@canary upgrade latest
npx @tailwindcss/upgrade
```

After either upgrade: run `npm run lint` and `npm run build`, fix failures, and update this file if versions/scripts change.

## Pull requests

Before merging any pull request:

1. **Read all comments** on the PR — conversation comments, review comments (including those on specific lines), and bot comments. Address or acknowledge them. Do not merge while review feedback is unresolved.
2. **Wait for CI to complete successfully.** GitHub Actions (and other required checks) on the PR must finish and pass. Do not merge while checks are pending, failed, cancelled, or skipped when they are required. If CI fails, fix the cause and wait for a green run before merging.
