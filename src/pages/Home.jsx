import { useEffect } from 'react'
import { translations, useLang } from '../lib/i18n'
import { SHOW_REVIEWS } from '../lib/flags'
import Newsletter from '../components/Newsletter'
import InstagramFeed from '../components/InstagramFeed'
import './Home.css'

const ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
]

function useFadeUp() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Home({ lang, onNav }) {
  const t = useLang(lang)
  const tx = translations
  useFadeUp()

  return (
    <div className="home">
      {/* HERO — .hero-bg is the full-bleed band, .hero is capped so it doesn't stretch on ultra-wide screens */}
      <div className="hero-bg">
        <section className="hero">
          <div className="hero-left">
            <p className="hero-eyebrow">{t(tx.hero.eyebrow)}</p>
            <h1 className="hero-title">
              {t(tx.hero.title1)}<br />
              {t(tx.hero.title2)}<em>{t(tx.hero.titleEm)}</em>{t(tx.hero.title3)}
            </h1>
            <p className="hero-sub">{t(tx.hero.sub)}</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onNav('contact')}>{t(tx.hero.cta1)}</button>
              <button className="btn-outline" onClick={() => onNav('about')}>{t(tx.hero.cta2)}</button>
            </div>
          </div>
          <div className="hero-right">
            <picture>
              <source media="(max-width: 960px)" srcSet="./assets/eugenie-hero-mobile.jpg" />
              <img src="./assets/eugenie-hero.jpg" alt="Eugenie Do"
                onError={e => { e.target.style.display = 'none' }} />
            </picture>
            <div className="hero-badges">
              <div className="hero-badge hero-badge-logo">
                <img src="./assets/remax-platine.png" alt="RE/MAX Platine" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SERVICES */}
      <section className="services-section">
        <div className="container">
          <p className="section-label">{t(tx.services.label)}</p>
          <h2 className="section-title" style={{ marginBottom: '56px' }}>{t(tx.services.title)}</h2>
          <div className="services-grid">
            {tx.services.items.map((s, i) => (
              <div className="service-card fade-up" key={i}>
                <div className="service-icon">{ICONS[i]}</div>
                <h3>{t(s.title)}</h3>
                <p>{t(s.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {SHOW_REVIEWS && (
        <section className="testimonials-section">
          <div className="container">
            <p className="section-label">{t(tx.testimonials.label)}</p>
            <h2 className="section-title" style={{ marginBottom: '48px' }}>
              {t(tx.testimonials.title1)}<br />{t(tx.testimonials.title2)}
            </h2>
            <div className="testimonials-grid">
              {tx.testimonials.items.map(item => (
                <div className="testimonial-card fade-up" key={item.name}>
                  <div className="testimonial-photo">
                    <img src={item.photo} alt={item.name}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                    <div className="testimonial-photo-fallback">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="stars">★★★★★</div>
                  <blockquote>{t(item.quote)}</blockquote>
                  <cite>{item.name}<span>{t(item.role)}</span></cite>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <Newsletter lang={lang} />

      {/* BLOG PREVIEW */}
      <section className="blog-preview-section">
        <div className="container">
          <div className="blog-header">
            <div>
              <p className="section-label">{t(tx.blog.label)}</p>
              <h2 className="section-title">{t(tx.blog.title1)}<br />{t(tx.blog.title2)}</h2>
            </div>
            <button className="read-all-btn" onClick={() => { onNav('blog'); window.scrollTo({ top: 0 }) }}>
              {t(tx.blog.readAll)}
            </button>
          </div>
          <div className="blog-grid">
            {tx.blog.posts.map((p, i) => (
              <div className="blog-card fade-up" key={i}>
                <div className="blog-card-img" style={{ background: ['var(--blush)','#ddd8d0','#ccc6bc'][i] }} />
                <p className="blog-meta">{t(p.date)} · <span>{t(p.tag)}</span></p>
                <h3>{t(p.title)}</h3>
                <p>{t(p.excerpt)}</p>
                <button className="read-more" onClick={() => onNav('blog')}>{t(tx.blog.readMore)}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <InstagramFeed lang={lang} />
    </div>
  )
}
