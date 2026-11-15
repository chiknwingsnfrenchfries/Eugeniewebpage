// sitemap.xml with every indexable page and its other-language versions.
import { ROUTES, LANGS } from '../lib/routes.js'

const SITE = 'https://eugeniedo.com'
const hreflang = (l) => (l === 'fr' ? 'fr-CA' : 'en-CA')

export function GET() {
  const urls = Object.values(ROUTES)
    .filter((r) => !r.noindex)
    .flatMap((r) => LANGS.map((lang) => {
      const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${hreflang(l)}" href="${SITE}${r[l]}"/>`).join('\n')
      return `  <url>\n    <loc>${SITE}${r[lang]}</loc>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${r.fr}"/>\n  </url>`
    }))
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
