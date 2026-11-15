// Every page of the site, with its URL in each language.
// To add a language later: add its key to LANGS and a path to every route.
//
// noindex: true keeps a page out of search engines and the sitemap. Use it for
// placeholder pages until they have real content.
import { SHOW_REVIEWS } from './flags.js'

export const LANGS = ['fr', 'en']

export const ROUTES = {
  home:      { en: '/en/', fr: '/fr/' },
  about:     { en: '/en/about/', fr: '/fr/a-propos/' },
  reviews:   { en: '/en/reviews/', fr: '/fr/avis/', noindex: !SHOW_REVIEWS },
  blog:      { en: '/en/blog/', fr: '/fr/blogue/', noindex: true },
  resources: { en: '/en/client-resources/', fr: '/fr/ressources-clients/' },
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
  privacy:   { en: '/en/privacy/', fr: '/fr/confidentialite/', noindex: true },
}

// URL of a page in a language: href('about', 'fr') → '/fr/a-propos/'
export function href(key, lang) {
  return ROUTES[key][lang]
}

// Old hash URLs (#/fr/about) used page keys; map them to the new paths.
export function legacyHashTargets() {
  const out = {}
  for (const [key, r] of Object.entries(ROUTES)) out[key] = { en: r.en, fr: r.fr }
  return out
}
