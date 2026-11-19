// Copy for the ads-only landing page /fr/estimation-gratuite/ and its thank-you
// page. French (Quebec) only, exactly as approved in the 2026-11-18 handover.
// Existing FAQ answers are shared with the resources page (valuation-copy.js).
import { valuation } from './valuation-copy.js'

export const PHONE_DISPLAY = '(438) 410-2420'
export const PHONE_SHORT = '438 410-2420'
export const PHONE_TEL = '+14384102420'

// ⚠️ Items 02–04 of "Ce que vous recevez" may only go live once Eugenie has
// confirmed every estimate includes them. Set to false to cut them.
export const SHOW_MARKET_ITEMS = true

export const ads = {
  title: 'Estimation gratuite de votre maison en 24 h | Eugenie Do, RE/MAX Platine',
  description: "Combien vaut votre maison aujourd'hui? Estimation gratuite de la valeur marchande, préparée par Eugenie Do, courtière immobilière résidentielle chez RE/MAX Platine. Réponse en 24 h, sans engagement.",
  headerLine: 'Courtière · RE/MAX Platine',
  eyebrow: 'Grand Montréal · Estimation gratuite',
  h1: "Combien vaut votre maison aujourd'hui?",
  h1Em: '100 % gratuit. Réponse en 24 h.',
  form: {
    title: 'Demandez votre estimation gratuite',
    address: 'Adresse de la propriété',
    addressPlaceholder: '123, rue Principale, Brossard',
    unit: 'App.',
    unitOpt: '(opt.)',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Courriel',
    phone: 'Téléphone',
    phoneOpt: '(facultatif)',
    consent: "J'aimerais aussi recevoir les nouvelles du marché d'Eugenie (facultatif).",
    submit: 'Recevoir mon estimation',
    sending: 'Envoi en cours…',
    checks: ['100 % gratuit', 'Aucune obligation de vendre', 'Confidentiel'],
    notice: 'Eugenie vous contactera au sujet de votre demande. Vos renseignements ne sont jamais vendus.',
    privacy: 'Politique de confidentialité',
    error: `Une erreur est survenue. Veuillez réessayer ou appeler au ${PHONE_DISPLAY}.`,
    required: 'Ce champ est requis.',
    invalidEmail: 'Veuillez entrer un courriel valide.',
    invalidPhone: 'Veuillez entrer un numéro de téléphone valide.',
  },
  receive: {
    eyebrow: 'Ce que vous recevez',
    title: "Plus qu'un chiffre : un portrait de votre marché",
    items: [
      { text: 'Une fourchette de valeur réaliste pour votre propriété' },
      { text: 'Les ventes récentes de propriétés semblables dans votre secteur', market: true },
      { text: 'Les propriétés à vendre qui vous feraient concurrence', market: true },
      { text: 'Le délai de vente observé pour ce type de propriété', market: true },
      { text: "Les explications d'Eugenie, par courriel ou au téléphone" },
    ],
    disclaimer: "Opinion de la valeur marchande préparée par une courtière immobilière. Ce n'est pas une évaluation agréée ni l'évaluation municipale.",
  },
  how: {
    title: 'Comment ça fonctionne',
    steps: [
      { title: 'Vous remplissez le formulaire', body: "Moins d'une minute : votre adresse et vos coordonnées. Aucun engagement." },
      { title: 'Eugenie analyse votre propriété', body: 'Elle compare les ventes récentes et les propriétés semblables dans votre secteur.' },
      { title: 'Vous recevez votre estimation en 24 h', body: "Par courriel ou par téléphone, comme vous préférez. Ensuite, c'est vous qui décidez." },
    ],
    cta: 'Recevoir mon estimation',
  },
  about: {
    eyebrow: 'Votre courtière',
    title: 'Eugenie Do',
    body: "Courtière immobilière résidentielle chez RE/MAX Platine et recrue de l'année 2025 de l'agence, Eugenie accompagne les propriétaires du Grand Montréal en français, en anglais et en vietnamien. Son expertise en construction l'aide à repérer ce qui ajoute vraiment de la valeur à une propriété.",
    points: [
      'Vous traitez directement avec Eugenie, du premier appel au notaire',
      'Service en français, en anglais et en vietnamien',
      'Expertise en construction et en rénovation',
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    items: [
      { q: valuation.faq.items[0].q.fr, a: valuation.faq.items[0].a.fr },
      { q: 'Je ne compte pas vendre avant un an. Ça vaut la peine?', a: 'Oui. Plusieurs propriétaires demandent une estimation pour planifier. Vous n\'avez aucune obligation de vendre.' },
      { q: valuation.faq.items[2].q.fr, a: valuation.faq.items[2].a.fr },
      { q: valuation.faq.items[3].q.fr, a: valuation.faq.items[3].a.fr },
      { q: 'Pourquoi demandez-vous mon adresse?', a: 'Elle permet de choisir les ventes comparables de votre secteur. Elle reste confidentielle.' },
      { q: 'Que faites-vous de mes renseignements?', a: 'Ils servent uniquement à préparer votre estimation et à vous contacter. Ils ne sont jamais vendus.', privacyLink: true },
    ],
  },
  closing: {
    title: 'Connaître la valeur de votre propriété, sans engagement.',
    body: 'Que vous vendiez cette année ou plus tard, commencez par les bons chiffres.',
    cta: 'Recevoir mon estimation',
    call: 'Appeler',
    text: 'Texter',
  },
  footer: {
    agency: 'Eugenie Do, courtière immobilière résidentielle · RE/MAX Platine, agence immobilière',
    privacy: 'Politique de confidentialité',
    cookies: 'Préférences de témoins',
    copy: '© 2026 Eugenie Do · RE/MAX Platine',
  },
  sticky: { cta: 'Recevoir mon estimation', callLabel: 'Appeler Eugenie' },
  thanks: {
    title: 'Merci! Votre demande est bien reçue | Eugenie Do',
    heading: 'Merci, {prenom}!',
    headingNoName: 'Merci!',
    headingEm: 'Votre demande est bien reçue.',
    body: "Eugenie prépare votre estimation et vous écrira d'ici 24 heures.",
    brokerLine: 'Courtière immobilière résidentielle · RE/MAX Platine',
    hurry: 'Pressé? Joignez Eugenie directement :',
    call: 'Appeler',
    text: 'Texter',
    footnote: `${PHONE_DISPLAY} · Service en français, en anglais et en vietnamien`,
  },
}
