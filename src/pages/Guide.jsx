import { translations, useLang } from '../lib/i18n'
import './Guide.css'

// Placeholder page shared by the four guides (guide-island, guide-north, guide-south, guide-buyer)
export default function Guide({ lang, onNav, guideKey }) {
  const t = useLang(lang)
  const tx = translations.guidePage
  const guide = tx.guides[guideKey]

  if (!guide) return null

  return (
    <section className="guide-section">
      <div className="container">
        <button className="guide-back" onClick={() => onNav('resources')}>{t(tx.backToResources)}</button>
        <p className="section-label">{t(tx.label)}</p>
        <h1 className="section-title guide-title">{t(guide.title)}</h1>
        <p className="guide-sub">{t(guide.sub)}</p>

        <div className="guide-coming-soon">
          <div className="guide-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h2>{t(tx.comingSoonTitle)}</h2>
          <p>{t(tx.comingSoonBody)}</p>
          <button className="btn-primary" onClick={() => onNav('contact')}>{t(tx.cta)}</button>
        </div>
      </div>
    </section>
  )
}
