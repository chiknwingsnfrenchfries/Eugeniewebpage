import { useState } from 'react'
import { supabaseInsert } from '../lib/supabase'
import { translations, useLang } from '../lib/i18n'
import './Newsletter.css'

export default function Newsletter({ lang }) {
  const t = useLang(lang)
  const tx = translations.newsletter
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await supabaseInsert('newsletter', { email, source: 'eugeniedo.com-newsletter', lang })
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="newsletter-strip">
      <div className="container">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h3>{t(tx.title)}</h3>
            <p>{t(tx.sub)}</p>
          </div>
          {status === 'done' ? (
            <p className="newsletter-done">{t(tx.done)}</p>
          ) : (
            <form className="newsletter-form" onSubmit={submit}>
              <input type="email" required placeholder={t(tx.placeholder)}
                value={email} onChange={e => setEmail(e.target.value)} />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? '…' : t(tx.btn)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
