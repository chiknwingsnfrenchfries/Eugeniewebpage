import { useRef, useState, useEffect } from 'react'
import { translations, useLang } from '../lib/i18n'
import './InstagramFeed.css'

// Placeholder photos until the Instagram API feed is wired in
const PLACEHOLDER_POSTS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', link: '#' },
  { id: 2, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', link: '#' },
  { id: 3, img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', link: '#' },
  { id: 4, img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', link: '#' },
  { id: 5, img: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=600&q=80', link: '#' },
  { id: 6, img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80', link: '#' },
  { id: 7, img: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80', link: '#' },
]

export default function InstagramFeed({ lang }) {
  const t = useLang(lang)
  const tx = translations.instagram
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [])

  const scrollByCard = (dir) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.ig-card')
    const cardWidth = card ? card.offsetWidth + 16 : 280
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' })
  }

  // Mouse drag-to-scroll (desktop). mousemove/mouseup live on window so the
  // drag can never get "stuck" when the cursor leaves the track.
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false })

  const endDrag = () => {
    if (!dragState.current.isDown) return
    dragState.current.isDown = false
    trackRef.current?.classList.remove('dragging')
  }

  const onMouseDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    const el = trackRef.current
    dragState.current = { isDown: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false }
    el.classList.add('dragging')
  }

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragState.current.isDown) return
      const el = trackRef.current
      if (!el) return
      const dx = e.pageX - dragState.current.startX
      if (Math.abs(dx) > 5) dragState.current.moved = true
      el.scrollLeft = dragState.current.scrollLeft - dx * 1.2
    }
    const onMouseUp = () => endDrag()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('blur', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('blur', onMouseUp)
    }
  }, [])

  // Swallow the click that ends a drag so it doesn't follow the card link
  const onCardClick = (e) => {
    if (dragState.current.moved) e.preventDefault()
  }

  return (
    <section className="ig-section">
      <div className="container">
        <p className="section-label">{t(tx.label)}</p>
        <h2 className="section-title ig-title">{t(tx.title)}</h2>

        <div className="ig-track" ref={trackRef} onMouseDown={onMouseDown}>
          {PLACEHOLDER_POSTS.map(post => (
            <a className="ig-card" key={post.id} href={post.link} target="_blank" rel="noopener" onClick={onCardClick}>
              <img src={post.img} alt="Instagram post" loading="lazy" draggable="false" />
              <div className="ig-card-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
                  <rect x="2" y="2" width="20" height="20" rx="5.5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="0.6" fill="white" stroke="none" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="ig-footer-row">
          <a className="ig-label" href="https://instagram.com/eugeniedo_remax" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="2" width="20" height="20" rx="5.5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
            </svg>
            <span>{t(tx.handle)}</span>
          </a>
          <div className="ig-arrows">
            <button
              className="ig-arrow"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollLeft}
              aria-label="Previous"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              className="ig-arrow"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollRight}
              aria-label="Next"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        <div className="ig-social-row">
          <p className="ig-social-label">{t(tx.also)}</p>
          <div className="ig-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener" className="ig-social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" className="ig-social-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener" className="ig-social-btn" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--cream)" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
