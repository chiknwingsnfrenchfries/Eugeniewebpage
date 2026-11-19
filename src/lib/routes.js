// Every page of the site, with its URL in each language.
// To add a language later: add its key to LANGS and a path to every route.
//
// noindex: true keeps a page out of search engines and the sitemap. Use it for
// placeholder pages until they have real content.
// layout: 'ads' → paid-traffic landing page: no site nav/footer, no canonical
// or language alternates, never linked from the rest of the site. A route may
// exist in only some languages (just leave the others out).
import { SHOW_REVIEWS } from './flags.js'

export const LANGS = ['fr', 'en']

export const ROUTES = {
  home:      { en: '/en/', fr: '/fr/' },
  about:     { en: '/en/about/', fr: '/fr/a-propos/' },
  reviews:   { en: '/en/reviews/', fr: '/fr/avis/', noindex: !SHOW_REVIEWS },
  blog:      { en: '/en/blog/', fr: '/fr/blogue/', noindex: true },
  resources: { en: '/en/client-resources/', fr: '/fr/ressources-clients/' },
  'home-valuation': {
    en: '/en/client-resources/home-valuation/',
    fr: '/fr/ressources-clients/estimation-maison/',
  },
  'guide-island': {
    en: '/en/client-resources/island-of-montreal-buyers-guide/',
    fr: '/fr/ressources-clients/guide-acheteur-ile-de-montreal/',
    noindex: true,
  },
  'guide-north': {
    en: '/en/client-resources/north-shore-buyers-guide/',
    fr: '/fr/ressources-clients/guide-acheteur-rive-nord/',
    noindex: true,
  },
  'guide-south': {
    en: '/en/client-resources/south-shore-buyers-guide/',
    fr: '/fr/ressources-clients/guide-acheteur-rive-sud/',
    noindex: true,
  },
  'guide-buyer': {
    en: '/en/client-resources/buyers-guide/',
    fr: '/fr/ressources-clients/guide-de-l-acheteur/',
    noindex: true,
  },
  contact:   { en: '/en/contact/', fr: '/fr/contact/' },
  // Google Ads / Meta landing page for free home valuations (French only)
  'estimation-ads':        { fr: '/fr/estimation-gratuite/', noindex: true, layout: 'ads' },
  'estimation-ads-thanks': { fr: '/fr/estimation-gratuite/merci/', noindex: true, layout: 'ads' },
  privacy:   { en: '/en/privacy/', fr: '/fr/confidentialite/', noindex: true },
  terms:     { en: '/en/terms/', fr: '/fr/conditions-utilisation/', noindex: true },
}

// URL of a page in a language: href('about', 'fr') → '/fr/a-propos/'
export function href(key, lang) {
  return ROUTES[key][lang]
}

// Old hash URLs (#/fr/about) used page keys; map them to the new paths.
export function legacyHashTargets() {
  const out = {}
  for (const [key, r] of Object.entries(ROUTES)) if (r.en && r.fr) out[key] = { en: r.en, fr: r.fr }
  return out
}

// Languages a route exists in
export function routeLangs(key) {
  return LANGS.filter((l) => ROUTES[key][l])
}
