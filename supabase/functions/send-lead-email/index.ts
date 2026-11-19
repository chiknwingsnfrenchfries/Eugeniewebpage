// send-lead-email
// Supabase Edge Function — triggered by the database webhook `on_lead_insert`
// (leads table, INSERT). Sends two emails per lead:
//   1. A notification to Eugenie (contact@eugeniedo.com)
//   2. A confirmation to the lead, in their language (FR or EN)
//
// The emails depend on where the lead came from (leads.source):
//   'eugeniedo.com-estimation'  → home valuation request (eugeniedo.com)
//   'eugeniedo.com-contact'     → contact form (eugeniedo.com)
//   anything else / empty       → neighbourhood quiz (quiz.eugeniedo.com) — unchanged
//
// This file is the source of truth: deploy it by pasting it into
// Supabase → Edge Functions → send-lead-email (or `supabase functions deploy`).
//
// SECURITY: the leads table accepts public inserts, so every field is
// visitor-controlled. All values are HTML-escaped and length-capped before
// they go into an email (see clean()), and the confirmation is only sent to a
// syntactically valid address.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_ADDRESS   = 'allo@mail.eugeniedo.com';
const FROM_NAME      = 'Eugenie Do';
const EUGENIE_EMAIL  = 'contact@eugeniedo.com';

// Main site (eugeniedo.com) contact details used in the new emails
const SITE_PHONE_DISPLAY = '(438) 410-2420';
const SITE_PHONE_TEL     = '+14384102420';
const SIGNATURE_FR = 'Eugenie Do, courtière immobilière résidentielle, RE/MAX Platine';
const SIGNATURE_EN = 'Eugenie Do, residential real estate broker, RE/MAX Platine';

const SOURCE_ESTIMATION = 'eugeniedo.com-estimation';
const SOURCE_CONTACT    = 'eugeniedo.com-contact';

// ── HELPERS ────────────────────────────────────────────────────────────────

async function sendEmail(payload: {
  from: string;
  to: string;
  reply_to?: string;
  subject: string;
  html: string;
}) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return res.json();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Copy of the lead with every string HTML-escaped and capped in length,
// safe to put into email HTML. Non-strings (numbers, booleans) pass through.
function clean(raw: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k] = typeof v === 'string' ? escapeHtml(v.trim().slice(0, k === 'message' || k === 'question' ? 3000 : 300)) : v;
  }
  return out;
}

// For subject lines (plain text): no line breaks, capped.
function plain(v: unknown, max = 80): string {
  return String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/.test(v.trim());
}

function utmSummary(lead: Record<string, any>): string {
  return [
    lead.utm_source   ? `Source: ${lead.utm_source}`     : null,
    lead.utm_medium   ? `Medium: ${lead.utm_medium}`     : null,
    lead.utm_campaign ? `Campaign: ${lead.utm_campaign}` : null,
    lead.utm_content  ? `Content: ${lead.utm_content}`   : null,
    lead.utm_term     ? `Term: ${lead.utm_term}`         : null,
  ].filter(Boolean).join(' · ') || 'Direct / Organic';
}

// ── SHARED LAYOUT FOR eugeniedo.com EMAILS ─────────────────────────────────
// Same palette as the website: cream, blush, rose, dark.

const SITE_STYLES = `
  body{margin:0;padding:0;background:#faf6f2;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1714}
  .wrap{max-width:600px;margin:0 auto;padding:32px 16px}
  .card{background:#fff;border-radius:8px;overflow:hidden;border:1px solid #f2e8e0}
  .header{background:#1a1714;padding:28px 32px}
  .eyebrow{font-size:11px;font-weight:600;color:#c9806a;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 8px}
  .title{font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;color:#fff;line-height:1.25;margin:0}
  .sub{font-size:13px;color:rgba(255,255,255,0.6);margin:6px 0 0}
  .body{padding:28px 32px}
  .p{font-size:15px;line-height:1.7;color:#5a524c;margin:0 0 16px}
  .p strong{color:#1a1714}
  .label{font-size:10px;font-weight:600;color:#c9806a;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px}
  .box{background:#faf6f2;border-left:3px solid #c9806a;padding:14px 16px;margin:0 0 20px;font-size:15px;line-height:1.6;color:#1a1714}
  .field{background:#faf6f2;border-radius:4px;padding:10px 14px;margin:0 0 8px}
  .key{font-size:10px;font-weight:600;color:#9a8f87;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 3px}
  .val{font-size:14px;font-weight:500;color:#1a1714;word-break:break-word}
  .step{margin:0 0 12px;font-size:14px;line-height:1.6;color:#5a524c}
  .step b{color:#1a1714}
  .btn{display:inline-block;background:#c9806a;color:#fff !important;text-decoration:none;padding:14px 28px;border-radius:2px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase}
  .meta{background:#1a1714;border-radius:4px;padding:10px 14px;font-size:12px;color:rgba(255,255,255,0.65);margin:16px 0 20px;word-break:break-word}
  .meta b{color:#c9806a;font-weight:600}
  .footer{padding:16px 32px;border-top:1px solid #f2e8e0;font-size:11px;color:#9a8f87;text-align:center;line-height:1.6}
`;

function siteLayout(opts: { lang: 'fr' | 'en'; title: string; eyebrow: string; heading: string; sub?: string; body: string; footer: string }): string {
  return `<!DOCTYPE html>
<html lang="${opts.lang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${opts.title}</title>
<style>${SITE_STYLES}</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <p class="eyebrow">${opts.eyebrow}</p>
      <h1 class="title">${opts.heading}</h1>
      ${opts.sub ? `<p class="sub">${opts.sub}</p>` : ''}
    </div>
    <div class="body">
${opts.body}
    </div>
    <div class="footer">${opts.footer}</div>
  </div>
</div>
</body>
</html>`;
}

function field(key: string, val: string): string {
  return `<div class="field"><div class="key">${key}</div><div class="val">${val || '—'}</div></div>`;
}

function siteSignature(isFr: boolean): string {
  return `<p class="p" style="margin-top:24px">${isFr ? 'À bientôt,' : 'Talk soon,'}<br/>
        <strong>Eugenie Do</strong><br/>
        ${isFr ? 'Courtière immobilière résidentielle' : 'Residential real estate broker'} · RE/MAX Platine<br/>
        <a href="tel:${SITE_PHONE_TEL}" style="color:#a85f4a;text-decoration:none">${SITE_PHONE_DISPLAY}</a> ·
        <a href="https://eugeniedo.com/${isFr ? 'fr' : 'en'}/" style="color:#a85f4a;text-decoration:none">eugeniedo.com</a></p>`;
}

// Attribution block shown to Eugenie (UTMs, Google Ads click ID, page)
function attribution(lead: Record<string, any>): string {
  const clickId = lead.gclid ? 'gclid ✓' : lead.gbraid ? 'gbraid ✓' : lead.wbraid ? 'wbraid ✓' : null;
  const FORMS: Record<string, string> = {
    'estimation-ads': "Page d'annonces (landing1)",
    'estimation-ressources': 'Site · Ressources clients',
  };
  return `<div class="meta"><b>Provenance :</b> ${utmSummary(lead)}${clickId ? ` · <b>Google Ads :</b> ${clickId}` : ''}${lead.fbclid ? ' · <b>Meta :</b> fbclid ✓' : ''}
        ${lead.form_id ? `<br/><b>Formulaire :</b> ${FORMS[lead.form_id] || lead.form_id}` : ''}
        ${lead.landing_page ? `<br/><b>Page d'arrivée :</b> ${lead.landing_page}` : ''}
        ${lead.source_url ? `<br/><span style="color:rgba(255,255,255,0.45)">${lead.source_url}</span>` : ''}</div>`;
}

// Address with the optional unit ("App." field)
function fullAddress(lead: Record<string, any>): string {
  return lead.property_unit ? `${lead.property_address}, app. ${lead.property_unit}` : (lead.property_address || '');
}

// ── VALUATION (eugeniedo.com/…/estimation-maison) ──────────────────────────

function valuationNotification(lead: Record<string, any>): string {
  const name = `${lead.first_name || ''}${lead.last_name ? ' ' + lead.last_name : ''}`;
  return siteLayout({
    lang: 'fr',
    title: `Demande d'estimation — ${name}`,
    eyebrow: "🏠 Nouvelle demande d'estimation",
    heading: fullAddress(lead) || '—',
    sub: `${name} · Langue : ${lead.lang === 'en' ? 'EN' : 'FR'}`,
    body: `
      <p class="label">Propriété</p>
      ${field('Adresse', fullAddress(lead))}
      <p class="label" style="margin-top:20px">Coordonnées</p>
      ${field('Nom', name)}
      ${field('Courriel', lead.email)}
      ${field('Téléphone', lead.phone)}
      ${field('Consentement marketing', lead.marketing_consent ? '✅ Oui' : '❌ Non')}
      ${attribution(lead)}
      <p style="margin:0"><a class="btn" href="mailto:${lead.email}?subject=${encodeURIComponent('Votre estimation — ' + plain(lead.property_address, 60))}">Répondre à ${lead.first_name || 'ce contact'} →</a></p>
      <p class="p" style="margin-top:16px;font-size:13px">Promesse faite au client : réponse en 24 heures.</p>`,
    footer: 'eugeniedo.com · formulaire d\'estimation',
  });
}

function valuationConfirmation(lead: Record<string, any>): string {
  const isFr = lead.lang !== 'en';
  const first = lead.first_name || '';
  const addr = fullAddress(lead);
  if (isFr) {
    return siteLayout({
      lang: 'fr',
      title: "Votre demande d'estimation est bien reçue",
      eyebrow: 'Estimation gratuite',
      heading: `Merci, ${first}!`,
      sub: 'Votre demande est bien reçue.',
      body: `
      <p class="p">Bonjour <strong>${first}</strong>,</p>
      <p class="p">J'ai bien reçu votre demande d'estimation${addr ? ` pour la propriété située au <strong>${addr}</strong>` : ''}. Je vous contacterai en 24 heures avec votre estimation de la valeur marchande.</p>
      <p class="label" style="margin-top:24px">La suite</p>
      <p class="step"><b>1. J'analyse votre propriété.</b> Je compare les ventes récentes et les propriétés semblables dans votre secteur.</p>
      <p class="step"><b>2. Vous recevez votre estimation.</b> Par courriel ou par téléphone, en 24 heures, avec les explications.</p>
      <p class="p" style="margin-top:20px">L'estimation est gratuite et ne vous engage à rien. Pour toute question d'ici là :</p>
      <p style="margin:0 0 8px"><a class="btn" href="tel:${SITE_PHONE_TEL}">📞 ${SITE_PHONE_DISPLAY}</a></p>
      ${siteSignature(true)}`,
      footer: `${SIGNATURE_FR}<br/>Vous recevez ce courriel parce que vous avez demandé une estimation sur eugeniedo.com.`,
    });
  }
  return siteLayout({
    lang: 'en',
    title: 'Your valuation request has been received',
    eyebrow: 'Free home valuation',
    heading: `Thank you, ${first}!`,
    sub: 'Your request has been received.',
    body: `
      <p class="p">Hi <strong>${first}</strong>,</p>
      <p class="p">I've received your valuation request${addr ? ` for <strong>${addr}</strong>` : ''}. I'll get back to you within 24 hours with your market value estimate.</p>
      <p class="label" style="margin-top:24px">What happens next</p>
      <p class="step"><b>1. I analyze your property.</b> I compare recent sales and similar properties in your area.</p>
      <p class="step"><b>2. You receive your estimate.</b> By email or phone, within 24 hours, with the reasoning behind it.</p>
      <p class="p" style="margin-top:20px">The estimate is free and comes with no obligation. Any questions in the meantime:</p>
      <p style="margin:0 0 8px"><a class="btn" href="tel:${SITE_PHONE_TEL}">📞 ${SITE_PHONE_DISPLAY}</a></p>
      ${siteSignature(false)}`,
    footer: `${SIGNATURE_EN}<br/>You received this email because you requested a home valuation on eugeniedo.com.`,
  });
}

// ── CONTACT FORM (eugeniedo.com/…/contact) ─────────────────────────────────

function contactNotification(lead: Record<string, any>): string {
  const name = `${lead.first_name || ''}${lead.last_name ? ' ' + lead.last_name : ''}`;
  return siteLayout({
    lang: 'fr',
    title: `Nouveau message — ${name}`,
    eyebrow: '✉️ Nouveau message · formulaire de contact',
    heading: name || lead.email,
    sub: `${lead.role || 'Profil non précisé'} · Langue : ${lead.lang === 'en' ? 'EN' : 'FR'}`,
    body: `
      ${lead.message ? `<p class="label">Message</p><div class="box">${lead.message.replace(/\n/g, '<br/>')}</div>` : ''}
      <p class="label">Coordonnées</p>
      ${field('Profil', lead.role)}
      ${field('Courriel', lead.email)}
      ${field('Téléphone', lead.phone)}
      ${attribution(lead)}
      <p style="margin:0"><a class="btn" href="mailto:${lead.email}?subject=${encodeURIComponent('Re: votre message')}">Répondre à ${lead.first_name || 'ce contact'} →</a></p>`,
    footer: 'eugeniedo.com · formulaire de contact',
  });
}

function contactConfirmation(lead: Record<string, any>): string {
  const isFr = lead.lang !== 'en';
  const first = lead.first_name || '';
  const quote = lead.message ? `<p class="label" style="margin-top:20px">${isFr ? 'Votre message' : 'Your message'}</p><div class="box">${lead.message.replace(/\n/g, '<br/>')}</div>` : '';
  return siteLayout({
    lang: isFr ? 'fr' : 'en',
    title: isFr ? 'Merci pour votre message' : 'Thank you for your message',
    eyebrow: isFr ? 'Message reçu' : 'Message received',
    heading: isFr ? `Merci, ${first}!` : `Thank you, ${first}!`,
    body: `
      <p class="p">${isFr ? 'Bonjour' : 'Hi'} <strong>${first}</strong>,</p>
      <p class="p">${isFr
        ? "J'ai bien reçu votre message et je vous répondrai très bientôt."
        : "I've received your message and will get back to you very soon."}</p>
      ${quote}
      <p class="p">${isFr ? "Si c'est urgent, appelez-moi :" : 'If it\'s urgent, give me a call:'}</p>
      <p style="margin:0 0 8px"><a class="btn" href="tel:${SITE_PHONE_TEL}">📞 ${SITE_PHONE_DISPLAY}</a></p>
      ${siteSignature(isFr)}`,
    footer: isFr
      ? `${SIGNATURE_FR}<br/>Vous recevez ce courriel parce que vous avez écrit via eugeniedo.com.`
      : `${SIGNATURE_EN}<br/>You received this email because you wrote through eugeniedo.com.`,
  });
}

// ── QUIZ (quiz.eugeniedo.com) — unchanged from the original function ───────
// Only change: the lead passed in is HTML-escaped (see clean()).

function buildEugenieEmail(lead: Record<string, any>): string {
  const lang       = lead.lang === 'en' ? 'EN' : 'FR';
  const matchLabel = lead.match_pct ? `${lead.match_pct}%` : 'N/A';
  const phone      = lead.phone || '—';
  const country    = lead.country || '—';
  const utm        = [
    lead.utm_source   ? `Source: ${lead.utm_source}`   : null,
    lead.utm_medium   ? `Medium: ${lead.utm_medium}`   : null,
    lead.utm_campaign ? `Campaign: ${lead.utm_campaign}` : null,
    lead.utm_content  ? `Content: ${lead.utm_content}` : null,
  ].filter(Boolean).join(' · ') || 'Direct / Organic';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Nouveau lead — ${lead.first_name}</title>
<style>
  body{margin:0;padding:0;background:#F7F2EA;font-family:'Helvetica Neue',Arial,sans-serif}
  .wrap{max-width:600px;margin:0 auto;padding:32px 16px}
  .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)}
  .header{background:#2B3A28;padding:28px 32px}
  .header-label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:6px}
  .header-name{font-size:24px;font-weight:800;color:#E8B84B;margin:0}
  .header-sub{font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px}
  .body{padding:28px 32px}
  .match-box{background:#F7F2EA;border-radius:8px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:16px}
  .match-pct{font-size:36px;font-weight:900;color:#C8952A;line-height:1}
  .match-info{}
  .match-neighbourhood{font-size:16px;font-weight:800;color:#2B3A28}
  .match-region{font-size:12px;color:#888;font-weight:600;margin-top:2px}
  .section{margin-bottom:20px}
  .section-label{font-size:10px;font-weight:800;color:#C8952A;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px}
  .field-row{display:flex;gap:8px;margin-bottom:8px}
  .field{flex:1;background:#F7F2EA;border-radius:6px;padding:10px 14px}
  .field-key{font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:3px}
  .field-val{font-size:14px;font-weight:600;color:#1A1A1A}
  .question-box{background:#F7F2EA;border-left:3px solid #C8952A;border-radius:0 8px 8px 0;padding:14px 16px;margin-bottom:20px}
  .question-text{font-size:15px;color:#2B3A28;line-height:1.6;font-style:italic}
  .utm-bar{background:#2B3A28;border-radius:6px;padding:10px 14px;font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:24px}
  .utm-label{font-weight:700;color:#E8B84B;margin-right:8px}
  .reply-btn{display:block;background:#C8952A;color:#fff;text-decoration:none;text-align:center;padding:14px 24px;border-radius:40px;font-size:14px;font-weight:800;letter-spacing:0.05em;margin-bottom:8px}
  .footer{padding:16px 32px;border-top:1px solid #F0EBE0;font-size:11px;color:#aaa;text-align:center}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <div class="header-label">🏡 Nouveau lead · Quiz Quartier</div>
      <div class="header-name">${lead.first_name}${lead.last_name ? ' ' + lead.last_name : ''}</div>
      <div class="header-sub">${lead.email} · ${phone} · ${country} · Langue: ${lang}</div>
    </div>
    <div class="body">

      <!-- Match -->
      <div class="match-box">
        <div class="match-pct">${matchLabel}</div>
        <div class="match-info">
          <div class="match-neighbourhood">${lead.top_match || '—'}</div>
          <div class="match-region">${lead.top_match_region || ''}</div>
        </div>
      </div>

      <!-- Contact info -->
      <div class="section">
        <div class="section-label">Coordonnées</div>
        <div class="field-row">
          <div class="field">
            <div class="field-key">Courriel</div>
            <div class="field-val">${lead.email}</div>
          </div>
          <div class="field">
            <div class="field-key">Téléphone</div>
            <div class="field-val">${phone}</div>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <div class="field-key">Pays</div>
            <div class="field-val">${country}</div>
          </div>
          <div class="field">
            <div class="field-key">Langue</div>
            <div class="field-val">${lang}</div>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <div class="field-key">Consentement marketing</div>
            <div class="field-val">${lead.marketing_consent ? '✅ Oui' : '❌ Non'}</div>
          </div>
        </div>
      </div>

      <!-- Question -->
      <div class="section">
        <div class="section-label">Question du lead</div>
        <div class="question-box">
          <div class="question-text">"${lead.question || '—'}"</div>
        </div>
      </div>

      <!-- Attribution -->
      <div class="utm-bar">
        <span class="utm-label">Source:</span>${utm}
        ${lead.source_url ? ` · <span style="color:rgba(255,255,255,0.4)">${lead.source_url}</span>` : ''}
      </div>

      <!-- Reply CTA -->
      <a class="reply-btn" href="mailto:${lead.email}?subject=Re: Votre quartier idéal — ${lead.top_match || 'Résultats'}">
        Répondre à ${lead.first_name} →
      </a>

    </div>
    <div class="footer">
      Eugenie Do · RE/MAX Québec · quiz.eugeniedo.com
    </div>
  </div>
</div>
</body>
</html>`;
}

function buildLeadConfirmationEmail(lead: Record<string, any>): string {
  const isFr      = lead.lang !== 'en';
  const firstName = lead.first_name || '';
  const match     = lead.top_match || '';
  const matchPct  = lead.match_pct ? `${lead.match_pct}%` : '';
  const region    = lead.top_match_region || '';

  if (isFr) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Votre quartier idéal — ${match}</title>
<style>
  body{margin:0;padding:0;background:#F7F2EA;font-family:'Helvetica Neue',Arial,sans-serif}
  .wrap{max-width:600px;margin:0 auto;padding:32px 16px}
  .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)}
  .header{background:#2B3A28;padding:36px 32px;text-align:center}
  .header-eyebrow{font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:12px}
  .header-title{font-size:28px;font-weight:800;color:#fff;line-height:1.2;margin:0 0 6px}
  .header-title em{color:#E8B84B;font-style:italic}
  .header-sub{font-size:14px;color:rgba(255,255,255,0.6);margin:0}
  .body{padding:32px}
  .match-hero{text-align:center;padding:24px;background:#F7F2EA;border-radius:10px;margin-bottom:28px}
  .match-pct-label{font-size:11px;font-weight:700;color:#C8952A;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px}
  .match-pct-val{font-size:52px;font-weight:900;color:#C8952A;line-height:1;margin-bottom:6px}
  .match-name{font-size:22px;font-weight:800;color:#2B3A28;margin-bottom:4px}
  .match-region{font-size:13px;color:#888;font-weight:600}
  .greeting{font-size:16px;color:#2B3A28;line-height:1.7;margin-bottom:20px;font-weight:500}
  .greeting strong{font-weight:800;color:#2B3A28}
  .divider{border:none;border-top:1px solid #EDE7D9;margin:24px 0}
  .next-steps{margin-bottom:24px}
  .next-label{font-size:11px;font-weight:800;color:#C8952A;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:14px}
  .step{display:flex;gap:14px;margin-bottom:14px;align-items:flex-start}
  .step-num{width:28px;height:28px;border-radius:50%;background:#2B3A28;color:#E8B84B;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
  .step-text{font-size:14px;color:#444;line-height:1.6;font-weight:500}
  .cta-btn{display:block;background:#C8952A;color:#fff;text-decoration:none;text-align:center;padding:16px 24px;border-radius:40px;font-size:15px;font-weight:800;letter-spacing:0.04em;margin-bottom:24px}
  .signature{font-size:14px;color:#555;line-height:1.7}
  .signature strong{font-weight:800;color:#2B3A28}
  .footer{padding:16px 32px;border-top:1px solid #F0EBE0;font-size:11px;color:#aaa;text-align:center}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <div class="header-eyebrow">Votre résultat de quiz</div>
      <h1 class="header-title">Votre quartier idéal est<br/><em>${match}</em></h1>
      <p class="header-sub">${region} · Grand Montréal</p>
    </div>
    <div class="body">

      <div class="match-hero">
        <div class="match-pct-label">Compatibilité</div>
        <div class="match-pct-val">${matchPct}</div>
        <div class="match-name">${match}</div>
        <div class="match-region">${region}</div>
      </div>

      <p class="greeting">
        Bonjour <strong>${firstName}</strong>,<br/><br/>
        Merci d'avoir complété le quiz de quartier. J'ai bien reçu votre message et je vous contacterai très bientôt pour discuter de vos résultats et répondre à vos questions.<br/><br/>
        En attendant, voici ce que je vous suggère.
      </p>

      <hr class="divider"/>

      <div class="next-steps">
        <div class="next-label">Prochaines étapes</div>
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text"><strong>Explorez ${match}</strong> — promenez-vous dans le quartier, visitez ses commerces locaux et imaginez-vous y vivre au quotidien.</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text"><strong>Préparez vos questions</strong> — budget, type de propriété, écoles, transport. Nous couvrirons tout ça ensemble.</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text"><strong>Je vous appelle bientôt</strong> — je prendrai contact avec vous d'ici 24–48 heures pour une conversation sans pression.</div>
        </div>
      </div>

      <a class="cta-btn" href="tel:+15145008818">📞 +1 514 500-8818</a>

      <p class="signature">
        À très bientôt,<br/>
        <strong>Eugenie Do</strong><br/>
        Courtière immobilière · RE/MAX Québec<br/>
        <a href="https://eugeniedo.com" style="color:#C8952A;text-decoration:none">eugeniedo.com</a>
      </p>

    </div>
    <div class="footer">
      Eugenie Do · RE/MAX Québec · quiz.eugeniedo.com<br/>
      Vous recevez ce courriel parce que vous avez soumis le quiz de quartier.
    </div>
  </div>
</div>
</body>
</html>`;
  }

  // English version
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your ideal neighbourhood — ${match}</title>
<style>
  body{margin:0;padding:0;background:#F7F2EA;font-family:'Helvetica Neue',Arial,sans-serif}
  .wrap{max-width:600px;margin:0 auto;padding:32px 16px}
  .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)}
  .header{background:#2B3A28;padding:36px 32px;text-align:center}
  .header-eyebrow{font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:12px}
  .header-title{font-size:28px;font-weight:800;color:#fff;line-height:1.2;margin:0 0 6px}
  .header-title em{color:#E8B84B;font-style:italic}
  .header-sub{font-size:14px;color:rgba(255,255,255,0.6);margin:0}
  .body{padding:32px}
  .match-hero{text-align:center;padding:24px;background:#F7F2EA;border-radius:10px;margin-bottom:28px}
  .match-pct-label{font-size:11px;font-weight:700;color:#C8952A;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px}
  .match-pct-val{font-size:52px;font-weight:900;color:#C8952A;line-height:1;margin-bottom:6px}
  .match-name{font-size:22px;font-weight:800;color:#2B3A28;margin-bottom:4px}
  .match-region{font-size:13px;color:#888;font-weight:600}
  .greeting{font-size:16px;color:#2B3A28;line-height:1.7;margin-bottom:20px;font-weight:500}
  .greeting strong{font-weight:800;color:#2B3A28}
  .divider{border:none;border-top:1px solid #EDE7D9;margin:24px 0}
  .next-steps{margin-bottom:24px}
  .next-label{font-size:11px;font-weight:800;color:#C8952A;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:14px}
  .step{display:flex;gap:14px;margin-bottom:14px;align-items:flex-start}
  .step-num{width:28px;height:28px;border-radius:50%;background:#2B3A28;color:#E8B84B;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
  .step-text{font-size:14px;color:#444;line-height:1.6;font-weight:500}
  .cta-btn{display:block;background:#C8952A;color:#fff;text-decoration:none;text-align:center;padding:16px 24px;border-radius:40px;font-size:15px;font-weight:800;letter-spacing:0.04em;margin-bottom:24px}
  .signature{font-size:14px;color:#555;line-height:1.7}
  .signature strong{font-weight:800;color:#2B3A28}
  .footer{padding:16px 32px;border-top:1px solid #F0EBE0;font-size:11px;color:#aaa;text-align:center}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <div class="header-eyebrow">Your quiz result</div>
      <h1 class="header-title">Your ideal neighbourhood is<br/><em>${match}</em></h1>
      <p class="header-sub">${region} · Greater Montreal</p>
    </div>
    <div class="body">

      <div class="match-hero">
        <div class="match-pct-label">Match Score</div>
        <div class="match-pct-val">${matchPct}</div>
        <div class="match-name">${match}</div>
        <div class="match-region">${region}</div>
      </div>

      <p class="greeting">
        Hi <strong>${firstName}</strong>,<br/><br/>
        Thank you for completing the neighbourhood quiz. I've received your message and will be in touch very soon to discuss your results and answer your questions.<br/><br/>
        In the meantime, here's what I suggest.
      </p>

      <hr class="divider"/>

      <div class="next-steps">
        <div class="next-label">Next steps</div>
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text"><strong>Explore ${match}</strong> — walk through the neighbourhood, visit local shops, and picture yourself living there day to day.</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text"><strong>Prepare your questions</strong> — budget, property type, schools, transit. We'll cover all of it together.</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text"><strong>I'll reach out soon</strong> — I'll contact you within 24–48 hours for a no-pressure conversation.</div>
        </div>
      </div>

      <a class="cta-btn" href="tel:+15145008818">📞 +1 514 500-8818</a>

      <p class="signature">
        Talk soon,<br/>
        <strong>Eugenie Do</strong><br/>
        Real Estate Broker · RE/MAX Québec<br/>
        <a href="https://eugeniedo.com" style="color:#C8952A;text-decoration:none">eugeniedo.com</a>
      </p>

    </div>
    <div class="footer">
      Eugenie Do · RE/MAX Québec · quiz.eugeniedo.com<br/>
      You received this email because you submitted the neighbourhood quiz.
    </div>
  </div>
</div>
</body>
</html>`;
}

// ── WHICH EMAILS FOR WHICH LEAD ────────────────────────────────────────────

function buildEmails(raw: Record<string, any>, lead: Record<string, any>) {
  const isFr = raw.lang !== 'en';
  const first = plain(raw.first_name, 40);
  const fullName = plain(`${raw.first_name || ''} ${raw.last_name || ''}`, 60) || plain(raw.email);

  if (raw.source === SOURCE_ESTIMATION) {
    return {
      notification: {
        from: `${FROM_NAME} · Site <${FROM_ADDRESS}>`,
        subject: `🏠 Demande d'estimation — ${plain(raw.property_unit ? `${raw.property_address}, app. ${raw.property_unit}` : raw.property_address, 70) || fullName}`,
        html: valuationNotification(lead),
      },
      confirmation: {
        from: `${FROM_NAME} <${FROM_ADDRESS}>`,
        subject: isFr
          ? "Votre demande d'estimation est bien reçue — Eugenie Do"
          : 'Your home valuation request is confirmed — Eugenie Do',
        html: valuationConfirmation(lead),
      },
    };
  }

  if (raw.source === SOURCE_CONTACT) {
    return {
      notification: {
        from: `${FROM_NAME} · Site <${FROM_ADDRESS}>`,
        subject: `✉️ Nouveau message — ${fullName}${raw.role ? ` · ${plain(raw.role, 30)}` : ''}`,
        html: contactNotification(lead),
      },
      confirmation: {
        from: `${FROM_NAME} <${FROM_ADDRESS}>`,
        subject: isFr ? 'Merci pour votre message — Eugenie Do' : 'Thank you for your message — Eugenie Do',
        html: contactConfirmation(lead),
      },
    };
  }

  // Quiz (original behaviour)
  const match = plain(raw.top_match, 60) || 'votre quartier';
  return {
    notification: {
      from: `${FROM_NAME} Quiz <${FROM_ADDRESS}>`,
      subject: `🏡 Nouveau lead — ${first || plain(raw.email)}${raw.top_match ? ` · ${plain(raw.top_match, 60)}` : ''}`,
      html: buildEugenieEmail(lead),
    },
    confirmation: {
      from: `${FROM_NAME} <${FROM_ADDRESS}>`,
      subject: isFr
        ? `Votre quartier idéal : ${match} — Eugenie Do`
        : `Your ideal neighbourhood: ${match} — Eugenie Do`,
      html: buildLeadConfirmationEmail(lead),
    },
  };
}

// ── MAIN HANDLER ───────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    // Supabase database webhooks send a POST with the record in body.record
    const body = await req.json();
    const raw: Record<string, any> = body.record ?? body;

    if (!isValidEmail(raw.email)) {
      return new Response(JSON.stringify({ error: 'No valid email in payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const email = raw.email.trim();
    const lead = clean(raw);
    const { notification, confirmation } = buildEmails(raw, lead);

    // Send both emails in parallel
    const [notif, confirm] = await Promise.allSettled([
      sendEmail({ ...notification, to: EUGENIE_EMAIL, reply_to: email }),
      sendEmail({ ...confirmation, to: email, reply_to: EUGENIE_EMAIL }),
    ]);

    const results = {
      source: raw.source ?? 'quiz',
      notification: notif.status === 'fulfilled' ? 'sent' : `failed: ${(notif as PromiseRejectedResult).reason}`,
      confirmation: confirm.status === 'fulfilled' ? 'sent' : `failed: ${(confirm as PromiseRejectedResult).reason}`,
    };

    console.log('Email results:', results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
