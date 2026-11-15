import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Resources from './pages/Resources'
import Guide from './pages/Guide'
import Reviews from './pages/Reviews'
import Blog from './pages/Blog'
import Contact from './pages/Contact'

// Language from hash, e.g. "#/fr" or "#/fr/about"; falls back to the browser language
function detectLang() {
  const hash = window.location.hash
  if (hash.startsWith('#/fr')) return 'fr'
  if (hash.startsWith('#/en')) return 'en'
  return navigator.language?.startsWith('fr') ? 'fr' : 'en'
}

// Page from hash, e.g. "#/fr/about" → 'about'
function detectPage() {
  const parts = window.location.hash.replace('#/', '').split('/')
  const page = parts[1]
  const valid = ['home', 'about', 'reviews', 'resources', 'guide-island', 'guide-north', 'guide-south', 'guide-buyer', 'blog', 'contact']
  return valid.includes(page) ? page : 'home'
}

export default function App() {
  const [lang, setLang] = useState(detectLang)
  const [page, setPage] = useState(detectPage)

  // Keep the hash in sync whenever lang or page changes
  useEffect(() => {
    const pagePart = page === 'home' ? '' : `/${page}`
    window.location.hash = `/${lang}${pagePart}`
  }, [lang, page])

  // Browser back/forward
  useEffect(() => {
    const onHashChange = () => {
      setLang(detectLang())
      setPage(detectPage())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleLang = () => setLang(l => l === 'en' ? 'fr' : 'en')

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <Nav current={page} lang={lang} onNav={navigate} onLangToggle={toggleLang} />

      {page === 'home'      && <Home      lang={lang} onNav={navigate} />}
      {page === 'about'     && <About     lang={lang} onNav={navigate} />}
      {page === 'reviews'   && <Reviews   lang={lang} onNav={navigate} />}
      {page === 'resources' && <Resources lang={lang} onNav={navigate} />}
      {page.startsWith('guide-') && <Guide lang={lang} onNav={navigate} guideKey={page} />}
      {page === 'blog'      && <Blog      lang={lang} />}
      {page === 'contact'   && <Contact   lang={lang} />}

      <Footer lang={lang} onNav={navigate} />
    </div>
  )
}
