import { useEffect } from 'react'
import { translations, useLang } from '../lib/i18n'
import Newsletter from '../components/Newsletter'
import './About.css'

export default function About({ lang, onNav }) {
  const t = useLang(lang)
  const tx = translations.about

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div>
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              <img src="./assets/eugenie-about.jpg" alt="Eugenie Do"
                onError={e => { e.target.parentElement.style.background = 'var(--blush)'; e.target.style.display = 'none' }} />
            </div>
            <div className="about-content fade-up">
              <p className="section-label">{t(tx.label)}</p>
              <h2>{t(tx.title)}</h2>
              <p>{t(tx.p1)}</p>
              <p>{t(tx.p2)}</p>
              <p>{t(tx.p3)}</p>
              <p>{t(tx.p4)}</p>
              <p>{t(tx.p5)}</p>
              <div className="about-facts">
                <p className="section-label" style={{ marginTop: '8px' }}>{t(tx.factsLabel)}</p>
                <div className="about-fact"><strong>{t(tx.factsArea)}</strong><span>{t(tx.factsAreaVal)}</span></div>
                <div className="about-fact"><strong>{t(tx.factsSpec)}</strong><span>{t(tx.factsSpecVal)}</span></div>
              </div>
              <div style={{ marginTop: '36px' }}>
                <button className="btn-primary" onClick={() => onNav('contact')}>{t(tx.cta)}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Newsletter lang={lang} />
    </div>
  )
}
