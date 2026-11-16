// Copy for the home valuation page (/fr/ressources-clients/estimation-maison/,
// /en/client-resources/home-valuation/).
// French: as approved in the 2026-11-14 handover. English: translation.
// Wording rule: "estimation" / "estimate" for what Eugenie provides — never
// "évaluation" (only used for the municipal assessment in the FAQ).
export const PHONE_DISPLAY = '(438) 410-2420'
export const PHONE_TEL = '+14384102420'

export const valuation = {
  h1: { fr: "Combien vaut votre maison aujourd'hui?", en: 'What is your home worth today?' },
  sub: {
    fr: "Recevez une estimation gratuite de la valeur marchande de votre propriété, préparée par une courtière immobilière qui connaît votre secteur. Réponse en 24 heures, sans engagement.",
    en: "Get a free estimate of your property's market value, prepared by a real estate broker who knows your area. Answer within 24 hours, no obligation.",
  },
  points: [
    { fr: 'Gratuit et sans obligation de vendre', en: 'Free, with no obligation to sell' },
    { fr: 'Basé sur les ventes récentes dans votre quartier', en: 'Based on recent sales in your neighbourhood' },
    { fr: 'Préparé par une personne, pas par un algorithme', en: 'Prepared by a person, not an algorithm' },
    { fr: 'Maison, condo ou plex, partout dans le Grand Montréal', en: 'House, condo or plex, anywhere in Greater Montreal' },
  ],
  agency: {
    fr: 'Eugenie Do, courtière immobilière résidentielle, RE/MAX Platine',
    en: 'Eugenie Do, residential real estate broker, RE/MAX Platine',
  },
  form: {
    title: { fr: 'Demandez votre estimation gratuite', en: 'Request your free estimate' },
    address: { fr: 'Adresse de la propriété', en: 'Property address' },
    addressPlaceholder: { fr: 'Ex. : 123, rue Principale, Brossard', en: 'e.g. 123 Main St, Brossard' },
    firstName: { fr: 'Prénom', en: 'First name' },
    lastName: { fr: 'Nom', en: 'Last name' },
    email: { fr: 'Courriel', en: 'Email' },
    phone: { fr: 'Téléphone (facultatif)', en: 'Phone (optional)' },
    consent: {
      fr: "J'aimerais recevoir les nouvelles du marché et les conseils immobiliers d'Eugenie.",
      en: "I'd like to receive market updates and real estate tips from Eugenie.",
    },
    submit: { fr: 'Recevoir mon estimation', en: 'Get my estimate' },
    sending: { fr: 'Envoi en cours…', en: 'Sending…' },
    notice: {
      fr: "En envoyant ce formulaire, vous acceptez qu'Eugenie Do communique avec vous au sujet de votre demande. Vos renseignements restent confidentiels et ne sont jamais vendus.",
      en: 'By submitting this form, you agree that Eugenie Do may contact you about your request. Your information stays confidential and is never sold.',
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
  // {name} is replaced by the visitor's first name
  thanks: {
    title: { fr: 'Merci, {name}!', en: 'Thank you, {name}!' },
    body: {
      fr: 'Votre demande est bien reçue. Eugenie vous contactera en 24 heures avec votre estimation. Pour toute question d\'ici là :',
      en: 'Your request has been received. Eugenie will contact you within 24 hours with your estimate. Any questions in the meantime:',
    },
  },
  how: {
    title: { fr: 'Comment ça fonctionne', en: 'How it works' },
    steps: [
      { title: { fr: 'Vous remplissez le formulaire.', en: 'You fill out the form.' }, body: { fr: "Ça prend moins d'une minute.", en: 'It takes less than a minute.' } },
      { title: { fr: 'Eugenie analyse votre propriété.', en: 'Eugenie analyzes your property.' }, body: { fr: 'Elle compare les ventes récentes et les propriétés semblables dans votre secteur.', en: 'She compares recent sales and similar properties in your area.' } },
      { title: { fr: 'Vous recevez votre estimation.', en: 'You receive your estimate.' }, body: { fr: 'Par courriel ou par téléphone, en 24 heures, avec les explications.', en: 'By email or phone, within 24 hours, with the reasoning behind it.' } },
    ],
  },
  why: {
    title: { fr: 'Pourquoi une estimation par une courtière?', en: 'Why an estimate from a broker?' },
    body: {
      fr: "Les outils en ligne donnent un chiffre instantané, mais ils ne voient pas votre cuisine rénovée, votre terrain ou votre rue. Une courtière tient compte de ce qui rend votre propriété différente, et vous explique d'où vient le chiffre.",
      en: "Online tools give you an instant number, but they can't see your renovated kitchen, your lot or your street. A broker takes into account what makes your property different, and explains where the number comes from.",
    },
  },
  about: {
    title: { fr: "À propos d'Eugenie", en: 'About Eugenie' },
    body: {
      fr: 'Eugenie Do est courtière immobilière résidentielle chez RE/MAX Platine. Elle accompagne des propriétaires du Grand Montréal en français, en anglais et en vietnamien.',
      en: 'Eugenie Do is a residential real estate broker with RE/MAX Platine. She works with homeowners across Greater Montreal in French, English and Vietnamese.',
    },
  },
  faq: {
    title: { fr: 'Questions fréquentes', en: 'Frequently asked questions' },
    items: [
      { q: { fr: 'Est-ce vraiment gratuit?', en: 'Is it really free?' }, a: { fr: "Oui. L'estimation est gratuite et ne vous engage à rien.", en: "Yes. The estimate is free and doesn't commit you to anything." } },
      { q: { fr: 'Dois-je vouloir vendre maintenant?', en: 'Do I need to want to sell now?' }, a: { fr: 'Non. Plusieurs propriétaires veulent simplement connaître la valeur de leur propriété pour planifier.', en: "No. Many homeowners simply want to know their property's value to plan ahead." } },
      { q: { fr: "Est-ce la même chose que l'évaluation municipale?", en: 'Is this the same as the municipal assessment?' }, a: { fr: "Non. L'évaluation municipale sert au calcul des taxes. L'estimation de la valeur marchande indique le prix que votre propriété pourrait obtenir sur le marché actuel.", en: "No. The municipal assessment is used to calculate property taxes. A market value estimate shows the price your property could get on today's market." } },
      { q: { fr: 'Faut-il une visite?', en: 'Do you need to visit?' }, a: { fr: 'Pas pour une première estimation. Une visite permet ensuite de préciser le chiffre, si vous le souhaitez.', en: 'Not for a first estimate. A visit can then refine the number, if you wish.' } },
    ],
  },
}
