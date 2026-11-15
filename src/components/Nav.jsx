import { useState, useEffect, useRef } from 'react'
import { translations, useLang } from '../lib/i18n'
import { SHOW_REVIEWS } from '../lib/flags'
import './Nav.css'

export default function Nav({ current, lang, onNav, onLangToggle }) {
  const t = useLang(lang)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobDropdownOpen, setMobDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the desktop dropdown when clicking anywhere outside it
  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const go = (page) => {
    onNav(page)
    setMenuOpen(false)
    setDropdownOpen(false)
    setMobDropdownOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goExternal = (url) => {
    window.open(url, '_blank', 'noopener')
    setMenuOpen(false)
    setDropdownOpen(false)
    setMobDropdownOpen(false)
  }

  const nav = translations.nav
  const menu = translations.resourcesMenu
  const QUIZ_URL = 'https://quiz.eugeniedo.com'
  const resourcesActive = ['resources', 'guide-island', 'guide-north', 'guide-south', 'guide-buyer'].includes(current)

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => go('home')}>
            <img src="./assets/eugenie-logo.png" alt="Eugenie Do" className="nav-logo-img" />
          </button>

          <ul className="nav-links">
            <li><button className={`nav-link ${current === 'about' ? 'active' : ''}`} onClick={() => go('about')}>{t(nav.about)}</button></li>
            {SHOW_REVIEWS && (
              <li><button className={`nav-link ${current === 'reviews' ? 'active' : ''}`} onClick={() => go('reviews')}>{t(nav.reviews)}</button></li>
            )}
            <li><button className={`nav-link ${current === 'blog' ? 'active' : ''}`} onClick={() => go('blog')}>{t(nav.blog)}</button></li>
            <li className="nav-dropdown-wrap" ref={dropdownRef}>
              <button
                className={`nav-link nav-dropdown-trigger ${resourcesActive ? 'active' : ''} ${dropdownOpen ? 'open' : ''}`}
                onClick={() => setDropdownOpen(o => !o)}
                onMouseEnter={() => setDropdownOpen(true)}
              >
                {t(nav.resources)}
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown" onMouseLeave={() => setDropdownOpen(false)}>
                  <button onClick={() => go('guide-island')}>{t(menu.islandGuide)}</button>
                  <button onClick={() => go('guide-north')}>{t(menu.northGuide)}</button>
                  <button onClick={() => go('guide-south')}>{t(menu.southGuide)}</button>
                  <button className="nav-dropdown-highlight" onClick={() => goExternal(QUIZ_URL)}>{t(menu.quiz)} ↗</button>
                  <button onClick={() => go('guide-buyer')}>{t(menu.buyerGuide)}</button>
                </div>
              )}
            </li>
            <li><button className="nav-cta" onClick={() => go('contact')}>{t(nav.contact)}</button></li>
          </ul>

          <div className="nav-right">
            <button className="lang-toggle" onClick={onLangToggle} aria-label="Toggle language">
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-drawer">
          <button onClick={() => go('about')}>{t(nav.about)}</button>
          {SHOW_REVIEWS && <button onClick={() => go('reviews')}>{t(nav.reviews)}</button>}
          <button onClick={() => go('blog')}>{t(nav.blog)}</button>
          <button className="mob-dropdown-trigger" onClick={() => setMobDropdownOpen(o => !o)}>
            {t(nav.resources)}
            <svg className={`chevron ${mobDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          {mobDropdownOpen && (
            <div className="mob-dropdown">
              <button onClick={() => go('guide-island')}>{t(menu.islandGuide)}</button>
              <button onClick={() => go('guide-north')}>{t(menu.northGuide)}</button>
              <button onClick={() => go('guide-south')}>{t(menu.southGuide)}</button>
              <button className="mob-dropdown-highlight" onClick={() => goExternal(QUIZ_URL)}>{t(menu.quiz)} ↗</button>
              <button onClick={() => go('guide-buyer')}>{t(menu.buyerGuide)}</button>
            </div>
          )}
          <button className="mob-cta" onClick={() => go('contact')}>{t(nav.contact)}</button>
          <button className="mob-lang" onClick={onLangToggle}>
            {lang === 'fr' ? '🇨🇦 English' : '🇫🇷 Français'}
          </button>
        </div>
      )}
    </>
  )
}
