import './Resources.css'
import { translations, useLang } from '../lib/i18n'

export default function Resources({ lang, onNav }) {
  const t = useLang(lang)
  const tx = translations.resources

  // A card either opens an external link, goes to an internal page, or falls back to Contact
  const open = (r) => {
    if (r.href) window.open(r.href, '_blank', 'noopener')
    else if (r.page) onNav(r.page)
    else onNav('contact')
  }

  return (
    <section className="resources-section">
      <div className="container">
        <p className="section-label">{t(tx.label)}</p>
        <h2 className="section-title resources-title">{t(tx.title1)}<br />{t(tx.title2)}</h2>
        <div className="resources-grid">
          {tx.items.map((r, i) => (
            <div className={`resource-card ${r.highlight ? 'resource-card-highlight' : ''}`} key={i}>
              <p className="resource-tag">{t(r.tag)}</p>
              <h3>{t(r.title)}</h3>
              <p>{t(r.body)}</p>
              <button className="resource-link" onClick={() => open(r)}>{t(r.cta)} {r.href ? '↗' : '→'}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
