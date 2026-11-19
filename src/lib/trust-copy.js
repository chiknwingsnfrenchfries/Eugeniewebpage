// Trust signals shared by the valuation pages (ads landing page + resources page).
// French: as approved in the 2026-11-18 handover. English: translation.
// Ratings are hard-coded on purpose (no live fetch). Update by hand when the
// Google review count changes.

// TODO(Edgar): replace with the direct link to Eugenie's Google Business
// Profile reviews. Until then this opens a Google search for her reviews.
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=eugenie+do+remax+platine+reviews'

export const RATING = { value: '5,0', valueEn: '5.0', count: 5 }

export const trust = {
  brokerLine: {
    fr: "Recrue de l'année 2025 · RE/MAX Platine · FR / EN / VI",
    en: '2025 Rookie of the Year · RE/MAX Platine · FR / EN / VI',
  },
  ratingShort: { fr: `${RATING.value} · ${RATING.count} avis Google`, en: `${RATING.valueEn} · ${RATING.count} Google reviews` },
  ratingLong: { fr: `${RATING.value} sur 5 · ${RATING.count} avis Google`, en: `${RATING.valueEn} out of 5 · ${RATING.count} Google reviews` },
  starsLabel: { fr: '5 étoiles sur 5', en: '5 out of 5 stars' },
  proof: [
    { big: { fr: "Recrue de l'année 2025", en: '2025 Rookie of the Year' }, small: { fr: 'RE/MAX Platine', en: 'RE/MAX Platine' }, long: true },
    { big: { fr: '100 %', en: '100%' }, small: { fr: 'gratuit', en: 'free' } },
    { big: { fr: '24 h', en: '24 h' }, small: { fr: 'délai de réponse', en: 'response time' } },
  ],
  reviews: {
    eyebrow: { fr: 'Avis Google', en: 'Google reviews' },
    title: { fr: 'Ce que disent ses clients', en: 'What her clients say' },
    readAll: { fr: `Lire les ${RATING.count} avis sur Google →`, en: `Read all ${RATING.count} reviews on Google →` },
    items: [
      {
        lang: 'en', // quoted as written on Google
        quote: "Eugenie helped us sell our home in the West Island and buy our new house in the Laurentians [...] we truly felt she had our best interests at heart. She is super organised and she does her research well before she proposes anything to us.",
        caption: {
          fr: "Maz · Vente dans l'Ouest-de-l'Île et achat dans les Laurentides · Avis Google",
          en: 'Maz · Sold in the West Island and bought in the Laurentians · Google review',
        },
      },
      {
        lang: 'fr', // quoted as written on Google
        quote: "Une personne humaine, disponible en tout temps, à l'écoute, qui ne nous a jamais mis de pression, mais qui est aussi extrêmement compétente! [...] Quelqu'un qui connaît très bien tout ce qu'il y a à savoir au niveau technique des propriétés et des rénovations.",
        caption: { fr: 'Olivier G. · Premier achat · Avis Google', en: 'Olivier G. · First purchase · Google review' },
      },
    ],
  },
}

// Opening/closing quote marks per page language
export function quoteMarks(lang) {
  return lang === 'fr' ? ['« ', ' »'] : ['“', '”']
}
