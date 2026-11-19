// Browser-side handler shared by both home valuation forms:
//   - /fr/estimation-gratuite/                      (ads landing page, form_id "estimation-ads")
//   - /fr/ressources-clients/estimation-maison/ (+EN) (indexed page, form_id "estimation-ressources")
//
// Expected form fields (by name): property_address, property_unit, first_name,
// last_name, email, phone, marketing_consent, website (honeypot).
// Each input sits in a wrapper that contains a <p class="...-err" data-err hidden>.
// Validation follows the inputs' `required` attributes.
//
// The form element carries:
//   data-form-id   "estimation-ads" | "estimation-ressources"
//   data-lang      "fr" | "en"
//   data-msgs      JSON: { required, invalidEmail, invalidPhone, sending, submit }
import { supabaseInsert } from './supabase.js'

export const LEAD_SOURCE = 'eugeniedo.com-estimation'
const PENDING_KEY = 'ed_lead_pending'

const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/

// North American numbers → E.164 (+15145551234). With a leading + any 8+ digits
// are accepted. Returns '' if empty, null if invalid.
export function toE164(raw) {
  const s = (raw || '').trim()
  if (!s) return ''
  const digits = s.replace(/\D/g, '')
  if (s.startsWith('+')) return digits.length >= 8 ? '+' + digits : null
  if (digits.length === 10) return '+1' + digits
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits
  return null
}

function dl(event) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}
function rs(...args) {
  if (typeof window.rs === 'function') window.rs(...args)
}

// Conversion events. Called once per lead: right after the insert on the
// resources page, or on the thank-you page for the ads page (see consumePendingLead).
export function trackLead(info) {
  dl({ event: 'generate_lead', form_id: info.form_id, lead_source: 'estimation' })
  if (info.form_id === 'estimation-ressources') dl({ event: 'estimation_submitted' }) // kept for existing GTM setups
  rs('track', 'generate_lead', {
    form_id: info.form_id,
    lead_source: 'estimation',
    lang: info.lang,
    has_phone: info.has_phone,
    marketing_consent: info.marketing_consent,
    has_click_id: info.has_click_id,
    utm_source: info.utm_source, utm_medium: info.utm_medium, utm_campaign: info.utm_campaign,
    utm_content: info.utm_content, utm_term: info.utm_term,
  })
  if (info.email) {
    rs('identify', info.email, {
      firstName: info.first_name, email: info.email, phone: info.phone,
      marketing_consent: info.marketing_consent, lang: info.lang,
    })
  }
}

// Thank-you page: returns the just-submitted lead (or null) and fires the
// conversion once. Reloading the page or opening it directly does not count again.
export function consumePendingLead() {
  let info = null
  try { info = JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null') } catch (e) { info = null }
  if (!info) return null
  try { sessionStorage.removeItem(PENDING_KEY) } catch (e) {}
  if (!info.tracked) trackLead(info)
  return info
}

// Tap-to-call / tap-to-text tracking for every tel: and sms: link inside `root`.
export function trackContactLinks(root = document) {
  root.querySelectorAll('a[href^="tel:"], a[href^="sms:"]').forEach((a) => {
    a.addEventListener('click', () => {
      const isCall = a.getAttribute('href').startsWith('tel:')
      const event = isCall ? 'click_call' : 'click_text'
      const location = a.dataset.track || null
      dl({ event, link_location: location, page_path: window.location.pathname })
      if (isCall) dl({ event: 'estimation_phone_click' }) // kept for existing GTM setups
      rs('track', event, { link_location: location, page_path: window.location.pathname })
    })
  })
}

// Columns added on 2026-11-19. If the migration has not been run yet, Supabase
// rejects the whole insert; we then retry with the older field set so the lead is
// never lost (unit folded into the address).
const NEW_COLUMNS = ['property_unit', 'fbclid', 'landing_page', 'form_id']

async function insertLead(lead) {
  try {
    await supabaseInsert('leads', lead)
  } catch (err) {
    if (!/PGRST204|could not find the .* column/i.test(String(err && err.message))) throw err
    console.warn('[estimation] new columns missing in Supabase; saving without them')
    const legacy = { ...lead }
    NEW_COLUMNS.forEach((k) => delete legacy[k])
    if (lead.property_unit) legacy.property_address = `${lead.property_address}, app. ${lead.property_unit}`
    await supabaseInsert('leads', legacy)
  }
}

export function initEstimationForm(form, { onSuccess, redirectTo } = {}) {
  const formId = form.dataset.formId
  const lang = form.dataset.lang || 'fr'
  const msgs = JSON.parse(form.dataset.msgs || '{}')
  const btn = form.querySelector('button[type=submit]')
  const formError = form.querySelector('[data-form-error]')
  const el = form.elements

  function setError(input, msg) {
    const p = input.closest('[data-field]')?.querySelector('[data-err]')
    input.setAttribute('aria-invalid', msg ? 'true' : 'false')
    if (p) {
      p.textContent = msg || ''
      p.hidden = !msg
      if (p.id) input.setAttribute('aria-describedby', p.id)
    }
  }

  function validate() {
    const checks = []
    for (const name of ['property_address', 'property_unit', 'first_name', 'last_name', 'email', 'phone']) {
      const input = el[name]
      if (!input) continue
      const val = input.value.trim()
      let msg = null
      if (input.required && !val) msg = msgs.required
      else if (name === 'property_address' && val.length < 5) msg = msgs.required
      else if (name === 'email' && !EMAIL_RE.test(val)) msg = msgs.invalidEmail
      else if (name === 'phone' && toE164(val) === null) msg = msgs.invalidPhone
      checks.push([input, msg])
    }
    checks.forEach(([input, msg]) => setError(input, msg))
    const firstBad = checks.find(([, msg]) => msg)
    if (firstBad) firstBad[0].focus()
    return !firstBad
  }

  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target, null)
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (formError) formError.hidden = true
    if (!validate()) return

    const firstName = el.first_name.value.trim()
    const done = (info) => {
      if (redirectTo) {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(info)) } catch (err) {}
        window.location.assign(redirectTo)
      } else if (onSuccess) {
        onSuccess(info)
      }
    }

    // Honeypot filled: behave as if it worked, but save and track nothing
    if (el.website && el.website.value) {
      done({ first_name: firstName, form_id: formId, tracked: true })
      return
    }

    const a = (window.getAttribution && window.getAttribution()) || {}
    const phone = toE164(el.phone.value) || null
    const email = el.email.value.trim().toLowerCase()
    const marketingConsent = !!el.marketing_consent?.checked
    const lead = {
      source: LEAD_SOURCE,
      form_id: formId,
      lang,
      property_address: el.property_address.value.trim(),
      property_unit: el.property_unit?.value.trim() || null,
      first_name: firstName,
      last_name: el.last_name.value.trim() || null,
      email,
      phone,
      marketing_consent: marketingConsent,
      source_url: window.location.href,
      landing_page: a.landing_page || window.location.pathname,
      utm_source: a.utm_source || null,
      utm_medium: a.utm_medium || null,
      utm_campaign: a.utm_campaign || null,
      utm_content: a.utm_content || null,
      utm_term: a.utm_term || null,
      gclid: a.gclid || null,
      gbraid: a.gbraid || null,
      wbraid: a.wbraid || null,
      fbclid: a.fbclid || null,
    }
    // TODO(zoho-bigin): push the lead to Bigin "Inquiries > Seller Inquiries".
    // Not implemented yet; must run server-side (Edge Function), never here.

    btn.disabled = true
    btn.textContent = msgs.sending
    try {
      await insertLead(lead)
    } catch (err) {
      console.error(err)
      if (formError) formError.hidden = false
      btn.disabled = false
      btn.textContent = msgs.submit
      return
    }

    // Saved. Conversion info (no address) for the tracking calls.
    const info = {
      form_id: formId, lang, first_name: firstName, email, phone,
      marketing_consent: marketingConsent, has_phone: !!phone,
      has_click_id: !!(lead.gclid || lead.gbraid || lead.wbraid || lead.fbclid),
      utm_source: lead.utm_source, utm_medium: lead.utm_medium, utm_campaign: lead.utm_campaign,
      utm_content: lead.utm_content, utm_term: lead.utm_term,
      tracked: false,
    }
    if (!redirectTo) { trackLead(info); info.tracked = true }
    done(info)
  })
}
