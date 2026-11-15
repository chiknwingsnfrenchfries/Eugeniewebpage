import { translations, useLang } from '../lib/i18n'
import './Blog.css'

const BG = ['var(--blush)','#ddd8d0','#ccc6bc','#b8b0a6','#d0c8be','#e0d8ce']

export default function Blog({ lang }) {
  const t = useLang(lang)
  const tx = translations.blogPage

  return (
    <section className="blog-section">
      <div className="container">
        <p className="section-label">{t(tx.label)}</p>
        <h2 className="section-title blog-title">{t(tx.title1)}<br />{t(tx.title2)}</h2>
        <div className="blog-full-grid">
          {tx.posts.map((p, i) => (
            <div className="blog-card" key={i}>
              <div className="blog-card-img" style={{ background: BG[i] }} />
              <p className="blog-meta">{t(p.date)} · <span>{t(p.tag)}</span></p>
              <h3>{t(p.title)}</h3>
              <p>{t(p.excerpt)}</p>
              <button className="read-more">{t(translations.blog.readMore)}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
