// Copy for the home valuation pages. One source for both versions:
//   - ads landing page   landing1.eugeniedo.com/ (+ /merci/)           French only, noindex
//   - site page          eugeniedo.com/fr/ressources-clients/estimation-maison/
//                        eugeniedo.com/en/client-resources/home-valuation/   indexed
// French: as approved in the 2026-11-14 and 2026-11-18 handovers. English: translation.
// Wording rule: "estimation" / "estimate" for what Eugenie provides, never
// "évaluation" (only used about the municipal assessment and in the disclaimer).

export const PHONE_DISPLAY = '(438) 410-2420'
export const PHONE_SHORT = '438 410-2420'
export const PHONE_TEL = '+14384102420'
export const SITE_ORIGIN = 'https://eugeniedo.com'
export { PRIVACY_POLICY_URL as PRIVACY_URL } from './legal.js' // GetTerms-hosted policy, per language

// ⚠️ Items 02–04 of "Ce que vous recevez" may only go live once Eugenie has
// confirmed every estimate includes them. Set to false to cut them.
export const SHOW_MARKET_ITEMS = true

export const est = {
  meta: {
    adsTitle: { fr: 'Estimation gratuite de votre maison en 24 h | Eugenie Do, RE/MAX Platine' },
    adsDescription: {
      fr: "Combien vaut votre maison aujourd'hui? Estimation gratuite de la valeur marchande, préparée par Eugenie Do, courtière immobilière résidentielle chez RE/MAX Platine. Réponse en 24 h, sans engagement.",
    },
  },
  headerLine: { fr: 'Courtière · RE/MAX Platine', en: 'Broker · RE/MAX Platine' },
  eyebrow: { fr: 'Grand Montréal · Estimation gratuite', en: 'Greater Montreal · Free home valuation' },
  h1: { fr: "Combien vaut votre maison aujourd'hui?", en: 'What is your home worth today?' },
  // \u00A0 = non-breaking space: keeps "100 %" and "24 h" on one line
  h1Em: { fr: '100\u00A0% gratuit. Réponse en 24\u00A0h.', en: '100% free. Answer within 24\u00A0h.' },
  callLabel: { fr: 'Appeler Eugenie', en: 'Call Eugenie' },

  form: {
    title: { fr: 'Demandez votre estimation gratuite', en: 'Request your free estimate' },
    address: { fr: 'Adresse de la propriété', en: 'Property address' },
    addressPlaceholder: { fr: '123, rue Principale, Brossard', en: '123 Main Street, Brossard' },
    unit: { fr: 'App.', en: 'Apt.' },
    opt: { fr: '(opt.)', en: '(opt.)' },
    firstName: { fr: 'Prénom', en: 'First name' },
    lastName: { fr: 'Nom', en: 'Last name' },
    email: { fr: 'Courriel', en: 'Email' },
    phone: { fr: 'Téléphone', en: 'Phone' },
    phoneOpt: { fr: '(facultatif)', en: '(optional)' },
    consent: {
      fr: "J'aimerais aussi recevoir les nouvelles du marché d'Eugenie (facultatif).",
      en: "I'd also like to receive Eugenie's market updates (optional).",
    },
    submit: { fr: 'Recevoir mon estimation', en: 'Get my estimate' },
    sending: { fr: 'Envoi en cours…', en: 'Sending…' },
    checks: [
      { fr: '100 % gratuit', en: '100% free' },
      { fr: 'Aucune obligation de vendre', en: 'No obligation to sell' },
      { fr: 'Confidentiel', en: 'Confidential' },
    ],
    notice: {
      fr: 'Eugenie vous contactera au sujet de votre demande. Vos renseignements ne sont jamais vendus.',
      en: 'Eugenie will contact you about your request. Your information is never sold.',
    },
    privacy: { fr: 'Politique de confidentialité', en: 'Privacy policy' },
    error: {
      fr: `Une erreur est survenue. Veuillez réessayer ou appeler au ${PHONE_DISPLAY}.`,
      en: `Something went wrong. Please try again or call ${PHONE_DISPLAY}.`,
    },
    required: { fr: 'Ce champ est requis.', en: 'This field is required.' },
    invalidEmail: { fr: 'Veuillez entrer un courriel valide.', en: 'Please enter a valid email address.' },
    invalidPhone: { fr: 'Veuillez entrer un numéro de téléphone valide.', en: 'Please enter a valid phone number.' },
  },

  receive: {
    eyebrow: { fr: 'Ce que vous recevez', en: 'What you receive' },
    title: { fr: "Plus qu'un chiffre : un portrait de votre marché", en: 'More than a number: a picture of your market' },
    items: [
      { fr: 'Une fourchette de valeur réaliste pour votre propriété', en: 'A realistic value range for your property' },
      { fr: 'Les ventes récentes de propriétés semblables dans votre secteur', en: 'Recent sales of similar properties in your area', market: true },
      { fr: 'Les propriétés à vendre qui vous feraient concurrence', en: 'The properties for sale you would be competing with', market: true },
      { fr: 'Le délai de vente observé pour ce type de propriété', en: 'How long this type of property takes to sell', market: true },
      { fr: "Les explications d'Eugenie, par courriel ou au téléphone", en: "Eugenie's explanations, by email or by phone" },
    ],
    disclaimer: {
      fr: "Opinion de la valeur marchande préparée par une courtière immobilière. Ce n'est pas une évaluation agréée ni l'évaluation municipale.",
      en: 'Opinion of market value prepared by a real estate broker. It is not a certified appraisal or the municipal assessment.',
    },
  },

  how: {
    title: { fr: 'Comment ça fonctionne', en: 'How it works' },
    steps: [
      {
        title: { fr: 'Vous remplissez le formulaire', en: 'You fill out the form' },
        body: { fr: "Moins d'une minute : votre adresse et vos coordonnées. Aucun engagement.", en: 'Less than a minute: your address and contact details. No commitment.' },
      },
      {
        title: { fr: 'Eugenie analyse votre propriété', en: 'Eugenie analyzes your property' },
        body: { fr: 'Elle compare les ventes récentes et les propriétés semblables dans votre secteur.', en: 'She compares recent sales and similar properties in your area.' },
      },
      {
        title: { fr: 'Vous recevez votre estimation en 24 h', en: 'You receive your estimate within 24 h' },
        body: { fr: "Par courriel ou par téléphone, comme vous préférez. Ensuite, c'est vous qui décidez.", en: "By email or by phone, whichever you prefer. After that, it's your call." },
      },
    ],
  },

  // Site version only (SEO content kept from the original page)
  why: {
    title: { fr: 'Pourquoi une estimation par une courtière?', en: 'Why an estimate from a broker?' },
    body: {
      fr: "Les outils en ligne donnent un chiffre instantané, mais ils ne voient pas votre cuisine rénovée, votre terrain ou votre rue. Une courtière tient compte de ce qui rend votre propriété différente, et vous explique d'où vient le chiffre.",
      en: "Online tools give you an instant number, but they can't see your renovated kitchen, your lot or your street. A broker takes into account what makes your property different, and explains where the number comes from.",
    },
  },

  about: {
    eyebrow: { fr: 'Votre courtière', en: 'Your broker' },
    title: { fr: 'Eugenie Do', en: 'Eugenie Do' },
    body: {
      fr: "Courtière immobilière résidentielle chez RE/MAX Platine et recrue de l'année 2025 de l'agence, Eugenie accompagne les propriétaires du Grand Montréal en français, en anglais et en vietnamien. Son expertise en construction l'aide à repérer ce qui ajoute vraiment de la valeur à une propriété.",
      en: "A residential real estate broker with RE/MAX Platine and the agency's 2025 Rookie of the Year, Eugenie works with homeowners across Greater Montreal in French, English and Vietnamese. Her construction expertise helps her spot what really adds value to a property.",
    },
    points: [
      { fr: 'Vous traitez directement avec Eugenie, du premier appel au notaire', en: 'You deal directly with Eugenie, from the first call to the notary' },
      { fr: 'Service en français, en anglais et en vietnamien', en: 'Service in French, English and Vietnamese' },
      { fr: 'Expertise en construction et en rénovation', en: 'Construction and renovation expertise' },
    ],
    agency: {
      fr: 'Eugenie Do, courtière immobilière résidentielle, RE/MAX Platine',
      en: 'Eugenie Do, residential real estate broker, RE/MAX Platine',
    },
  },

  faq: {
    title: { fr: 'Questions fréquentes', en: 'Frequently asked questions' },
    items: [
      { q: { fr: 'Est-ce vraiment gratuit?', en: 'Is it really free?' }, a: { fr: "Oui. L'estimation est gratuite et ne vous engage à rien.", en: "Yes. The estimate is free and doesn't commit you to anything." } },
      { q: { fr: 'Je ne compte pas vendre avant un an. Ça vaut la peine?', en: "I don't plan to sell for a year. Is it worth it?" }, a: { fr: "Oui. Plusieurs propriétaires demandent une estimation pour planifier. Vous n'avez aucune obligation de vendre.", en: 'Yes. Many homeowners ask for an estimate to plan ahead. You have no obligation to sell.' } },
      { q: { fr: "Est-ce la même chose que l'évaluation municipale?", en: 'Is this the same as the municipal assessment?' }, a: { fr: "Non. L'évaluation municipale sert au calcul des taxes. L'estimation de la valeur marchande indique le prix que votre propriété pourrait obtenir sur le marché actuel.", en: "No. The municipal assessment is used to calculate property taxes. A market value estimate shows the price your property could get on today's market." } },
      { q: { fr: 'Faut-il une visite?', en: 'Do you need to visit?' }, a: { fr: 'Pas pour une première estimation. Une visite permet ensuite de préciser le chiffre, si vous le souhaitez.', en: 'Not for a first estimate. A visit can then refine the number, if you wish.' } },
      { q: { fr: 'Pourquoi demandez-vous mon adresse?', en: 'Why do you need my address?' }, a: { fr: 'Elle permet de choisir les ventes comparables de votre secteur. Elle reste confidentielle.', en: 'It lets Eugenie pick the comparable sales in your area. It stays confidential.' } },
      { q: { fr: 'Que faites-vous de mes renseignements?', en: 'What do you do with my information?' }, a: { fr: 'Ils servent uniquement à préparer votre estimation et à vous contacter. Ils ne sont jamais vendus.', en: 'It is only used to prepare your estimate and to contact you. It is never sold.' }, privacyLink: true },
    ],
  },

  closing: {
    title: { fr: 'Connaître la valeur de votre propriété, sans engagement.', en: "Know your property's value, with no commitment." },
    body: { fr: 'Que vous vendiez cette année ou plus tard, commencez par les bons chiffres.', en: 'Whether you sell this year or later, start with the right numbers.' },
    cta: { fr: 'Recevoir mon estimation', en: 'Get my estimate' },
    call: { fr: 'Appeler', en: 'Call' },
    text: { fr: 'Texter', en: 'Text' },
  },

  footer: {
    agency: { fr: 'Eugenie Do, courtière immobilière résidentielle · RE/MAX Platine, agence immobilière', en: 'Eugenie Do, residential real estate broker · RE/MAX Platine, real estate agency' },
    privacy: { fr: 'Politique de confidentialité', en: 'Privacy policy' },
    cookies: { fr: 'Préférences de témoins', en: 'Cookie preferences' },
    copy: { fr: '© 2026 Eugenie Do · RE/MAX Platine', en: '© 2026 Eugenie Do · RE/MAX Platine' },
  },

  sticky: { cta: { fr: 'Recevoir mon estimation', en: 'Get my estimate' } },

  // Thank-you page (ads) and inline thank-you (site page). {prenom} = first name.
  thanks: {
    title: { fr: 'Merci! Votre demande est bien reçue | Eugenie Do', en: 'Thank you! Your request has been received | Eugenie Do' },
    heading: { fr: 'Merci, {prenom}!', en: 'Thank you, {prenom}!' },
    headingNoName: { fr: 'Merci!', en: 'Thank you!' },
    headingEm: { fr: 'Votre demande est bien reçue.', en: 'Your request has been received.' },
    body: { fr: "Eugenie prépare votre estimation et vous écrira d'ici 24 heures.", en: 'Eugenie is preparing your estimate and will write to you within 24 hours.' },
    brokerLine: { fr: 'Courtière immobilière résidentielle · RE/MAX Platine', en: 'Residential real estate broker · RE/MAX Platine' },
    hurry: { fr: 'Pressé? Joignez Eugenie directement :', en: 'In a hurry? Reach Eugenie directly:' },
    footnote: {
      fr: `${PHONE_DISPLAY} · Service en français, en anglais et en vietnamien`,
      en: `${PHONE_DISPLAY} · Service in French, English and Vietnamese`,
    },
  },
}

// t(est.h1, 'fr') → string (falls back to French)
export function tr(obj, lang) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[lang] ?? obj.fr ?? ''
}
