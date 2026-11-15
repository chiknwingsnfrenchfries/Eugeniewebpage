import { translations, useLang } from '../lib/i18n'
import './Reviews.css'

export default function Reviews({ lang }) {
  const t = useLang(lang)
  const tx = translations.reviewsPage
  const items = translations.testimonials.items

  return (
    <section className="reviews-section">
      <div className="container">
        <p className="section-label">{t(tx.label)}</p>
        <h2 className="section-title reviews-title">{t(tx.title1)}<br />{t(tx.title2)}</h2>
        <div className="reviews-grid">
          {items.map(item => (
            <div className="review-card" key={item.name}>
              <div className="review-photo">
                <img src={item.photo} alt={item.name}
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                <div className="review-photo-fallback">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="stars">★★★★★</div>
              <blockquote>{t(item.quote)}</blockquote>
              <cite>{item.name}<span>{t(item.role)}</span></cite>
            </div>
          ))}
        </div>
        <div className="reviews-more">
          <a href={tx.googleUrl} target="_blank" rel="noopener" className="btn-outline">{t(tx.seeMore)}</a>
        </div>
      </div>
    </section>
  )
}
