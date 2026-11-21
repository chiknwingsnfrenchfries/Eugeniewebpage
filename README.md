# eugeniedo.com

Static site built with [Astro](https://astro.build). Every page is a real HTML file at its own
URL, in French and English, so search engines and AI assistants can read it without running
JavaScript. Deployed to GitHub Pages by `.github/workflows/deploy-pages.yml` on every push to `main`.

## Two sites from one repo

| Site | Build | Output | Hosting |
|---|---|---|---|
| eugeniedo.com | `npm run build` | `dist/` | GitHub Pages (workflow on push to `main`) |
| landing1.eugeniedo.com (ads landing page, noindex) | `npm run build:landing` | `dist-landing/` | Cloudflare Workers (static assets), config `wrangler.landing.jsonc`, connected to this repo |

The ads landing page's routes are in `src-landing/pages/` (config: `astro.landing.config.mjs`,
static files: `public-landing/`). Its content is the same component as the indexed
valuation page on eugeniedo.com: `src/components/estimation/EstimationContent.astro`
(`variant="ads"` vs `variant="site"`). Copy: `src/lib/estimation-copy.js`; trust signals and
reviews: `src/lib/trust-copy.js`; form logic and tracking: `src/lib/estimation-form.js`.

## Run / build

```
npm ci
npm run dev        # local dev server
npm run build      # outputs dist/
npm run preview    # serve dist/ locally
```

## Where things are

```
src/lib/routes.js        every page and its URL in each language (+ noindex for placeholders)
src/lib/seo.js           <title> and meta description per page and language
src/lib/i18n.js          all page copy, FR + EN
src/lib/schema.js        structured data (RealEstateAgent) shown to search engines
src/lib/flags.js         SHOW_REVIEWS
src/lib/supabase.js      supabaseInsert() used by the forms
supabase/migrations/     SQL for the leads/newsletter tables (run in the Supabase SQL editor)
supabase/functions/      send-lead-email Edge Function (deploy by pasting into Supabase)
src/layouts/Base.astro   <head>, nav, footer, CSS (imported in the original cascade order)
src/components/          Nav, Footer, Newsletter, InstagramFeed, Tracking, FadeUp
src/views/               one file per page type (Placeholder.astro: empty privacy + terms pages)
src/pages/[...path].astro  generates every route from routes.js
src/pages/index.astro    "/" → /fr/ or /en/; also redirects old #/fr/about style links
src/styles/              page CSS + links.css (makes <a> links look like the old buttons)
public/                  images, robots.txt, .nojekyll
```

## Adding a page

1. Add it to `ROUTES` in `src/lib/routes.js` with an `en` and `fr` path.
2. Add its title and description to `src/lib/seo.js`.
3. Create a view in `src/views/` and register it in `src/pages/[...path].astro`.

The sitemap and the language alternates pick it up automatically. Pages marked `noindex`
are left out of the sitemap.

## Tracking and consent

`src/components/Tracking.astro` loads, in order:

1. **GetTerms** consent banner (must be the first script). It sets Google Consent Mode defaults
   per region and shares consent with quiz.eugeniedo.com.
2. **RudderStack.** Every page view is sent for every visitor ("pre-consent" mode, session-only
   ID). When a visitor accepts Analytics, RudderStack switches to persistent cookies so their
   visits can be linked over time.
3. **Google Tag Manager.** GA4 and Google Ads tags inside it follow Consent Mode.

The footer has a "Cookie preferences" link that reopens the banner. Comments at the top of
`Tracking.astro` list the bugs that must not come back.

## History

The repo held only compiled output until 2026-11-15. The source was recovered as a Vite + React
app, checked to be pixel-identical to the live site, then moved to Astro and checked again
with full-page screenshot comparisons of every page in both languages, at desktop and phone width.
