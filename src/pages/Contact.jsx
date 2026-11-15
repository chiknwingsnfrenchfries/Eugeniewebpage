import { useState } from 'react'
import { supabaseInsert } from '../lib/supabase'
import { translations, useLang } from '../lib/i18n'
import './Contact.css'

export default function Contact({ lang }) {
  const t = useLang(lang)
  const tx = translations.contact
  const [form,   setForm]   = useState({ role: '', first_name: '', last_name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await supabaseInsert('leads', {
        ...form,
        source: 'eugeniedo.com-contact',
        lang,
        last_name: form.last_name || null,
        phone:     form.phone    || null,
        message:   form.message  || null,
        role:      form.role     || null,
      })
      setStatus('success')
      setForm({ role: '', first_name: '', last_name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const roleOpts = tx.roleOpts[lang] || tx.roleOpts['en']

  return (
    <section className="contact-section">
      <div className="container">
        <p className="section-label">{t(tx.label)}</p>
        <h2 className="section-title contact-title">{t(tx.title)}</h2>
        <p className="contact-sub">{t(tx.sub)}</p>

        <div className="contact-grid">
          <form className="contact-form" onSubmit={submit}>
            <div className="form-group">
              <label>{t(tx.roleLabel)}</label>
              <select value={form.role} onChange={e => update('role', e.target.value)}>
                {roleOpts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t(tx.firstName)} *</label>
                <input type="text" required placeholder={t(tx.firstName)}
                  value={form.first_name} onChange={e => update('first_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>{t(tx.lastName)}</label>
                <input type="text" placeholder={t(tx.lastName)}
                  value={form.last_name} onChange={e => update('last_name', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>{t(tx.email)} *</label>
              <input type="email" required placeholder="your@email.com"
                value={form.email} onChange={e => update('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t(tx.phone)}</label>
              <input type="tel" placeholder="(514) 000-0000"
                value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t(tx.message)}</label>
              <textarea placeholder={t(tx.msgPlaceholder)}
                value={form.message} onChange={e => update('message', e.target.value)} />
            </div>
            <p className="form-consent">{t(tx.consent)}</p>
            {status === 'success' && <p className="form-status success">{t(tx.success)}</p>}
            {status === 'error'   && <p className="form-status error">{t(tx.error)}</p>}
            <button type="submit" className="btn-primary submit-btn" disabled={status === 'loading'}>
              {status === 'loading' ? t(tx.sending) : t(tx.submit)}
            </button>
          </form>

          <div className="contact-info">
            <h3>{t(tx.infoTitle)}</h3>
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <span>1850 rue Panama, #110<br />Brossard, QC, J4W 3C6</span>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.83-1.83a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <a href="tel:4384102420">(438) 410-2420</a>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <a href="mailto:contact@eugeniedo.com">contact@eugeniedo.com</a>
            </div>
            <div className="social-label">{t(tx.findMe)}</div>
            <div className="social-row">
              <a href="#" className="social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="white"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#141210"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
