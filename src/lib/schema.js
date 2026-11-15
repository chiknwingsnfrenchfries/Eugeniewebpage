// Structured data (schema.org JSON-LD) describing Eugenie as a real estate agent.
// Search engines and AI assistants read this to answer "who / where / what languages / phone".
export function agentSchema(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': 'https://eugeniedo.com/#eugenie-do',
    name: 'Eugenie Do',
    description: lang === 'fr'
      ? 'Courtière immobilière résidentielle chez RE/MAX Platine, au service des acheteurs et des vendeurs du Grand Montréal.'
      : 'Residential real estate broker at RE/MAX Platine, serving buyers and sellers across Greater Montreal.',
    url: 'https://eugeniedo.com/',
    image: 'https://eugeniedo.com/assets/eugenie-hero.jpg',
    logo: 'https://eugeniedo.com/assets/eugenie-logo.png',
    telephone: '+1-438-410-2420',
    email: 'contact@eugeniedo.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1850 rue Panama, #110',
      addressLocality: 'Brossard',
      addressRegion: 'QC',
      postalCode: 'J4W 3C6',
      addressCountry: 'CA',
    },
    areaServed: [
      { '@type': 'Place', name: lang === 'fr' ? 'Grand Montréal' : 'Greater Montreal' },
      { '@type': 'City', name: 'Montréal' },
      { '@type': 'City', name: 'Laval' },
      { '@type': 'City', name: 'Brossard' },
      { '@type': 'City', name: 'Longueuil' },
    ],
    knowsLanguage: ['fr', 'en', 'vi'],
    parentOrganization: { '@type': 'RealEstateAgent', name: 'RE/MAX Platine' },
    sameAs: ['https://instagram.com/eugeniedo_remax'],
  }
}
