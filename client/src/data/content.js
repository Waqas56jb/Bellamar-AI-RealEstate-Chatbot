// -----------------------------------------------------------------------------
// Bellamar Housing — chatbot content & translations
//
// All copy is sourced from the live site (bellamar-invest.com): a Split-based
// curated Croatian real-estate brand (Rentals / Verhuur, Sales / Verkoop,
// Projects / Projecten, Contact). Multilingual scope: NL, EN, PL, HR.
//
// This is the FRONTEND content layer only. Bot replies here are canned/mocked
// so the widget is fully demonstrable before the AI backend is connected.
// -----------------------------------------------------------------------------

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'nl', label: 'NL', name: 'Nederlands' },
  { code: 'hr', label: 'HR', name: 'Hrvatski' },
  { code: 'pl', label: 'PL', name: 'Polski' },
]

export const CONTACT = {
  company: 'Bellamar',
  location: 'Split, Croatia',
  phone: '+385 95 374 4906',
  email: 'executive@bellamarinvest.com',
}

// UI strings + welcome + quick-reply menu + canned answers, per language.
export const I18N = {
  en: {
    brand: 'Bellamar Housing',
    role: 'Real Estate Assistant',
    status: 'Online',
    badge: 'Private',
    welcomeTitle: 'Welcome to Bellamar',
    welcomeSubtitle:
      "Your trusted partner in Croatian real estate. Let's find your place on the Adriatic coast.",
    startButton: 'Start Conversation',
    greeting:
      "Hello! 👋 Welcome to Bellamar — your trusted partner in Croatian real estate. How can I help you today? ✨",
    inputPlaceholder: 'Write your message…',
    footer: 'Powered by Bellamar · AI Assistant available 24/7',
    typing: 'typing…',
    quickReplies: [
      { id: 'sales', icon: '🏠', text: 'Properties for Sale' },
      { id: 'rentals', icon: '🔑', text: 'Rental Properties' },
      { id: 'projects', icon: '🏗️', text: 'Our Projects' },
      { id: 'contact', icon: '📞', text: 'Contact & Viewing' },
    ],
    answers: {
      sales:
        'We currently offer exclusive apartments for sale in Marina, Dalmatia (30 min. from Split) — including the Skyline Penthouse Marina, a modern one-bedroom apartment, and several sea-view residences with private parking and storage. Would you like details on a specific home, or shall I arrange a viewing?',
      rentals:
        'Our rental portfolio is being prepared and will be available very soon. If you tell me what you are looking for (dates, size, budget), I can note your interest and our team will contact you as soon as listings go live.',
      projects:
        'Our signature projects on the Dalmatian coast include Marina Residence (sea-view apartments), Villa Marina (duplex villa with private pool) and Villa Bellamar (modern hillside villa). Which project would you like to know more about?',
      contact:
        'You can reach Bellamar in Split, Croatia at +385 95 374 4906 or executive@bellamarinvest.com. Share your name, email and what you are interested in, and our team will get back to you shortly.',
      lead: "Great — I'd love to connect you with our team. Could you share your name, email, and what you're interested in?",
      fallback:
        "Thanks for your message! I can help with properties for sale, rentals, our projects, or putting you in touch with our team in Split. What would you like to explore?",
    },
    leadPrompt: 'Leave your details and we will get back to you',
    leadName: 'Your name',
    leadEmail: 'Your email',
    leadInterest: 'What are you interested in?',
    leadSubmit: 'Send',
    leadThanks: 'Thank you! Our team will contact you shortly. ✨',
  },

  nl: {
    brand: 'Bellamar Housing',
    role: 'Vastgoed Assistent',
    status: 'Online',
    badge: 'Privé',
    welcomeTitle: 'Welkom bij Bellamar',
    welcomeSubtitle:
      'Uw vertrouwde partner in Kroatisch vastgoed. Laten we uw plek aan de Adriatische kust vinden.',
    startButton: 'Start Gesprek',
    greeting:
      'Hallo! 👋 Welkom bij Bellamar — uw vertrouwde partner in Kroatisch vastgoed. Hoe kan ik u vandaag helpen? ✨',
    inputPlaceholder: 'Typ uw bericht…',
    footer: 'Mogelijk gemaakt door Bellamar · AI-assistent 24/7 beschikbaar',
    typing: 'aan het typen…',
    quickReplies: [
      { id: 'sales', icon: '🏠', text: 'Woningen te koop' },
      { id: 'rentals', icon: '🔑', text: 'Huurwoningen' },
      { id: 'projects', icon: '🏗️', text: 'Onze projecten' },
      { id: 'contact', icon: '📞', text: 'Contact & bezichtiging' },
    ],
    answers: {
      sales:
        'Wij bieden momenteel exclusieve appartementen te koop aan in Marina, Dalmatië (30 min. van Split) — waaronder de Skyline Penthouse Marina, een modern appartement met één slaapkamer en diverse residenties met zeezicht, eigen parkeerplaats en berging. Wilt u details over een specifieke woning, of zal ik een bezichtiging regelen?',
      rentals:
        'Onze huurportefeuille wordt voorbereid en is binnenkort beschikbaar. Vertel mij waar u naar op zoek bent (data, grootte, budget) en ik noteer uw interesse; ons team neemt contact met u op zodra de woningen online staan.',
      projects:
        'Onze kenmerkende projecten aan de Dalmatische kust zijn Marina Residence (appartementen met zeezicht), Villa Marina (duplexvilla met privézwembad) en Villa Bellamar (moderne villa op een heuvel). Over welk project wilt u meer weten?',
      contact:
        'U kunt Bellamar in Split, Kroatië bereiken op +385 95 374 4906 of executive@bellamarinvest.com. Deel uw naam, e-mail en interesse, dan neemt ons team spoedig contact met u op.',
      lead: 'Graag breng ik u in contact met ons team. Kunt u uw naam, e-mail en interesse delen?',
      fallback:
        'Bedankt voor uw bericht! Ik kan u helpen met woningen te koop, huurwoningen, onze projecten of contact met ons team in Split. Wat wilt u verkennen?',
    },
    leadPrompt: 'Laat uw gegevens achter en wij nemen contact op',
    leadName: 'Uw naam',
    leadEmail: 'Uw e-mail',
    leadInterest: 'Waar bent u in geïnteresseerd?',
    leadSubmit: 'Versturen',
    leadThanks: 'Bedankt! Ons team neemt spoedig contact met u op. ✨',
  },

  hr: {
    brand: 'Bellamar Housing',
    role: 'Asistent za nekretnine',
    status: 'Online',
    badge: 'Privatno',
    welcomeTitle: 'Dobrodošli u Bellamar',
    welcomeSubtitle:
      'Vaš pouzdani partner za hrvatske nekretnine. Pronađimo vaše mjesto na jadranskoj obali.',
    startButton: 'Započni razgovor',
    greeting:
      'Pozdrav! 👋 Dobrodošli u Bellamar — vaš pouzdani partner za hrvatske nekretnine. Kako vam mogu pomoći danas? ✨',
    inputPlaceholder: 'Napišite poruku…',
    footer: 'Pokreće Bellamar · AI asistent dostupan 24/7',
    typing: 'piše…',
    quickReplies: [
      { id: 'sales', icon: '🏠', text: 'Nekretnine na prodaju' },
      { id: 'rentals', icon: '🔑', text: 'Najam nekretnina' },
      { id: 'projects', icon: '🏗️', text: 'Naši projekti' },
      { id: 'contact', icon: '📞', text: 'Kontakt i razgledavanje' },
    ],
    answers: {
      sales:
        'Trenutno nudimo ekskluzivne apartmane na prodaju u Marini, Dalmacija (30 min. od Splita) — uključujući Skyline Penthouse Marina, moderan jednosobni apartman i nekoliko rezidencija s pogledom na more, privatnim parkingom i spremištem. Želite li detalje o određenoj nekretnini ili da dogovorim razgledavanje?',
      rentals:
        'Naša ponuda za najam je u pripremi i uskoro će biti dostupna. Recite mi što tražite (datumi, veličina, budžet) i zabilježit ću vaš interes; naš tim će vas kontaktirati čim oglasi budu objavljeni.',
      projects:
        'Naši prepoznatljivi projekti na dalmatinskoj obali su Marina Residence (apartmani s pogledom na more), Villa Marina (dvoetažna vila s privatnim bazenom) i Villa Bellamar (moderna vila na obronku). O kojem projektu želite saznati više?',
      contact:
        'Bellamar u Splitu, Hrvatska možete kontaktirati na +385 95 374 4906 ili executive@bellamarinvest.com. Podijelite svoje ime, e-mail i interes te će vas naš tim ubrzo kontaktirati.',
      lead: 'Rado ću vas povezati s našim timom. Možete li podijeliti svoje ime, e-mail i interes?',
      fallback:
        'Hvala na poruci! Mogu pomoći s nekretninama na prodaju, najmom, našim projektima ili povezivanjem s našim timom u Splitu. Što želite istražiti?',
    },
    leadPrompt: 'Ostavite svoje podatke i javit ćemo vam se',
    leadName: 'Vaše ime',
    leadEmail: 'Vaš e-mail',
    leadInterest: 'Što vas zanima?',
    leadSubmit: 'Pošalji',
    leadThanks: 'Hvala! Naš tim će vas uskoro kontaktirati. ✨',
  },

  pl: {
    brand: 'Bellamar Housing',
    role: 'Asystent nieruchomości',
    status: 'Online',
    badge: 'Prywatne',
    welcomeTitle: 'Witamy w Bellamar',
    welcomeSubtitle:
      'Twój zaufany partner na rynku chorwackich nieruchomości. Znajdźmy Twoje miejsce na wybrzeżu Adriatyku.',
    startButton: 'Rozpocznij rozmowę',
    greeting:
      'Cześć! 👋 Witamy w Bellamar — Twoim zaufanym partnerze na rynku chorwackich nieruchomości. Jak mogę dziś pomóc? ✨',
    inputPlaceholder: 'Napisz wiadomość…',
    footer: 'Obsługiwane przez Bellamar · Asystent AI dostępny 24/7',
    typing: 'pisze…',
    quickReplies: [
      { id: 'sales', icon: '🏠', text: 'Nieruchomości na sprzedaż' },
      { id: 'rentals', icon: '🔑', text: 'Nieruchomości na wynajem' },
      { id: 'projects', icon: '🏗️', text: 'Nasze projekty' },
      { id: 'contact', icon: '📞', text: 'Kontakt i oglądanie' },
    ],
    answers: {
      sales:
        'Obecnie oferujemy ekskluzywne apartamenty na sprzedaż w Marinie, Dalmacja (30 min od Splitu) — w tym Skyline Penthouse Marina, nowoczesny apartament z jedną sypialnią oraz kilka rezydencji z widokiem na morze, prywatnym parkingiem i schowkiem. Chcesz poznać szczegóły konkretnej nieruchomości, czy mam umówić oglądanie?',
      rentals:
        'Nasza oferta wynajmu jest przygotowywana i wkrótce będzie dostępna. Powiedz mi, czego szukasz (terminy, wielkość, budżet), a zanotuję Twoje zainteresowanie; nasz zespół skontaktuje się, gdy tylko oferty będą dostępne.',
      projects:
        'Nasze flagowe projekty na wybrzeżu Dalmacji to Marina Residence (apartamenty z widokiem na morze), Villa Marina (dwupoziomowa willa z prywatnym basenem) i Villa Bellamar (nowoczesna willa na wzgórzu). O którym projekcie chcesz dowiedzieć się więcej?',
      contact:
        'Z Bellamar w Splicie (Chorwacja) skontaktujesz się pod numerem +385 95 374 4906 lub executive@bellamarinvest.com. Podaj imię, e-mail i swoje zainteresowanie, a nasz zespół wkrótce się odezwie.',
      lead: 'Chętnie połączę Cię z naszym zespołem. Czy możesz podać imię, e-mail i swoje zainteresowanie?',
      fallback:
        'Dziękujemy za wiadomość! Pomogę w sprawie nieruchomości na sprzedaż, wynajmu, naszych projektów lub kontaktu z naszym zespołem w Splicie. Co chcesz sprawdzić?',
    },
    leadPrompt: 'Zostaw swoje dane, a my się odezwiemy',
    leadName: 'Twoje imię',
    leadEmail: 'Twój e-mail',
    leadInterest: 'Czym jesteś zainteresowany?',
    leadSubmit: 'Wyślij',
    leadThanks: 'Dziękujemy! Nasz zespół wkrótce się skontaktuje. ✨',
  },
}

// Very small mock "router": maps a user message to a canned answer key.
// Replaced later by the real AI backend call.
export function resolveAnswerKey(text, lang) {
  const t = text.toLowerCase()
  const map = {
    sales: ['sale', 'buy', 'koop', 'kopen', 'prodaj', 'kupn', 'sprzeda', 'penthouse', 'apartment', 'appartement'],
    rentals: ['rent', 'huur', 'najam', 'wynaj', 'lease'],
    projects: ['project', 'villa', 'residence', 'projecten', 'projekt'],
    contact: ['contact', 'phone', 'email', 'call', 'kontakt', 'bel', 'telefon', 'viewing', 'bezichtig', 'razgledav'],
    lead: ['interested', 'interesse', 'zaintereso', 'zaintere', 'lead', 'callback', 'terugbel'],
  }
  for (const key of Object.keys(map)) {
    if (map[key].some((kw) => t.includes(kw))) return key
  }
  return 'fallback'
}
