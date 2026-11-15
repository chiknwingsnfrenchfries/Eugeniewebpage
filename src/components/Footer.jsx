import { translations, useLang } from '../lib/i18n'
import { SHOW_REVIEWS } from '../lib/flags'
import './Footer.css'

export default function Footer({ lang, onNav }) {
  const t = useLang(lang)
  const tx = translations
  const go = (page) => { onNav(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <button className="footer-logo" onClick={() => go('home')}>Eugenie <span>Do</span></button>
            <p>{t(tx.footer.tagline)}</p>
          </div>
          <div className="footer-col">
            <h4>{t(tx.footer.nav)}</h4>
            <ul>
              <li><button onClick={() => go('about')}>{t(tx.nav.about)}</button></li>
              {SHOW_REVIEWS && <li><button onClick={() => go('reviews')}>{t(tx.nav.reviews)}</button></li>}
              <li><button onClick={() => go('resources')}>{t(tx.nav.resources)}</button></li>
              <li><button onClick={() => go('blog')}>{t(tx.nav.blog)}</button></li>
              <li><button onClick={() => go('contact')}>{t(tx.nav.contact)}</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t(tx.footer.help)}</h4>
            <ul>
              <li><button>{t(tx.footer.terms)}</button></li>
              <li><button>{t(tx.footer.privacy)}</button></li>
              <li><a href="mailto:contact@eugeniedo.com">contact@eugeniedo.com</a></li>
              <li><a href="tel:4384102420">(438) 410-2420</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t(tx.footer.copy)}</span>
          <span>{t(tx.footer.region)}</span>
        </div>
      </div>
    </footer>
  )
}
