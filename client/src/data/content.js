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
    errorMessage: "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach us at **executive@bellamarinvest.com**.",
    offlineMessage: "Our assistant is currently offline. Please reach us at **executive@bellamarinvest.com** or **+385 95 374 4906**.",
    quickReplies: [
      { id: 'sales', icon: '🏠', text: 'Properties for Sale' },
      { id: 'rentals', icon: '🔑', text: 'Rental Properties' },
      { id: 'projects', icon: '🏗️', text: 'Our Projects' },
      { id: 'contact', icon: '📞', text: 'Contact & Viewing' },
    ],
    answers: {
      sales: `**Properties for Sale** 🏠

Exclusive apartments in **Marina, Dalmatia** _(30 min from Split)_:

- **Skyline Penthouse Marina** — duplex · 4 bed · panoramic sea views
- **Modern 1-Bedroom Apartment** — best value · move-in ready
- **Sea-view residences** — private parking & storage

Want details on one, or shall I arrange a **viewing**?`,
      rentals: `**Rentals** 🔑

Our rental portfolio is **coming soon**.

Tell me what you're looking for — dates, size, budget — and I'll note your interest. Our team will reach out the moment listings go live.`,
      projects: `**Our Projects** 🏗️

On the Dalmatian coast:

- **Marina Residence** — sea-view apartments
- **Villa Marina** — duplex villa with private pool
- **Villa Bellamar** — modern hillside villa

Which one would you like to explore?`,
      contact: `**Contact Bellamar** 📞

- 📍 Split, Croatia
- 📱 +385 95 374 4906
- ✉️ executive@bellamarinvest.com

Leave your **name & email** below and our team will get back to you shortly.`,
      lead: `I'd be glad to connect you with our team.

Please share your **name**, **email**, and what you're interested in.`,
      fallback: `I can help you with:

- 🏠 **Properties for sale**
- 🔑 **Rentals**
- 🏗️ **Our projects**
- 📞 **Contacting our team**

What would you like to explore?`,
    },
    leadFlow: {
      askName: "I'd be glad to connect you with our team. 😊\n\nFirst, what's your **name**?",
      askEmail: "Nice to meet you, **{name}**! What's the best **email** to reach you?",
      askInterest: "Got it. And what are you **interested in**? _(a specific property, rentals, an investment…)_",
      emailInvalid: "Hmm, that doesn't look like a valid email address. 🙏 Could you type it again?",
      done: "**Thank you, {name}!** ✨\n\nOur team will reach out to you at **{email}** shortly regarding **{interest}**.\n\nIn the meantime, feel free to ask me anything else!",
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
    errorMessage: 'Sorry, er is momenteel een verbindingsprobleem. Probeer het zo opnieuw, of bereik ons via **executive@bellamarinvest.com**.',
    offlineMessage: 'Onze assistent is momenteel offline. Bereik ons via **executive@bellamarinvest.com** of **+385 95 374 4906**.',
    quickReplies: [
      { id: 'sales', icon: '🏠', text: 'Woningen te koop' },
      { id: 'rentals', icon: '🔑', text: 'Huurwoningen' },
      { id: 'projects', icon: '🏗️', text: 'Onze projecten' },
      { id: 'contact', icon: '📞', text: 'Contact & bezichtiging' },
    ],
    answers: {
      sales: `**Woningen te koop** 🏠

Exclusieve appartementen in **Marina, Dalmatië** _(30 min. van Split)_:

- **Skyline Penthouse Marina** — duplex · 4 slaapkamers · zeezicht
- **Modern 1-slaapkamerappartement** — beste prijs · instapklaar
- **Residenties met zeezicht** — eigen parkeerplaats & berging

Wilt u details over één woning, of zal ik een **bezichtiging** regelen?`,
      rentals: `**Huurwoningen** 🔑

Onze huurportefeuille komt **binnenkort** beschikbaar.

Vertel me wat u zoekt — data, grootte, budget — en ik noteer uw interesse. Ons team neemt contact op zodra de woningen online staan.`,
      projects: `**Onze projecten** 🏗️

Aan de Dalmatische kust:

- **Marina Residence** — appartementen met zeezicht
- **Villa Marina** — duplexvilla met privézwembad
- **Villa Bellamar** — moderne villa op een heuvel

Welk project wilt u verkennen?`,
      contact: `**Contact Bellamar** 📞

- 📍 Split, Kroatië
- 📱 +385 95 374 4906
- ✉️ executive@bellamarinvest.com

Laat hieronder uw **naam & e-mail** achter, dan neemt ons team spoedig contact op.`,
      lead: `Ik breng u graag in contact met ons team.

Deel uw **naam**, **e-mail** en waar u in geïnteresseerd bent.`,
      fallback: `Ik kan u helpen met:

- 🏠 **Woningen te koop**
- 🔑 **Huurwoningen**
- 🏗️ **Onze projecten**
- 📞 **Contact met ons team**

Wat wilt u verkennen?`,
    },
    leadFlow: {
      askName: "Ik breng u graag in contact met ons team. 😊\n\nWat is uw **naam**?",
      askEmail: "Aangenaam, **{name}**! Op welk **e-mailadres** kunnen wij u bereiken?",
      askInterest: "Genoteerd. En waar bent u **in geïnteresseerd**? _(een specifieke woning, huur, een investering…)_",
      emailInvalid: "Hmm, dat lijkt geen geldig e-mailadres. 🙏 Kunt u het opnieuw typen?",
      done: "**Bedankt, {name}!** ✨\n\nOns team neemt spoedig contact met u op via **{email}** over **{interest}**.\n\nStel gerust nog een vraag!",
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
    errorMessage: 'Oprostite, trenutno imam poteškoća s povezivanjem. Pokušajte ponovno za trenutak ili nas kontaktirajte na **executive@bellamarinvest.com**.',
    offlineMessage: 'Naš asistent trenutno nije dostupan. Kontaktirajte nas na **executive@bellamarinvest.com** ili **+385 95 374 4906**.',
    quickReplies: [
      { id: 'sales', icon: '🏠', text: 'Nekretnine na prodaju' },
      { id: 'rentals', icon: '🔑', text: 'Najam nekretnina' },
      { id: 'projects', icon: '🏗️', text: 'Naši projekti' },
      { id: 'contact', icon: '📞', text: 'Kontakt i razgledavanje' },
    ],
    answers: {
      sales: `**Nekretnine na prodaju** 🏠

Ekskluzivni apartmani u **Marini, Dalmacija** _(30 min od Splita)_:

- **Skyline Penthouse Marina** — dvoetažni · 4 spavaće · pogled na more
- **Moderan jednosobni apartman** — najbolja cijena · useljiv
- **Rezidencije s pogledom na more** — privatni parking i spremište

Želite detalje o nekretnini ili da dogovorim **razgledavanje**?`,
      rentals: `**Najam** 🔑

Naša ponuda za najam **uskoro** stiže.

Recite mi što tražite — datumi, veličina, budžet — i zabilježit ću vaš interes. Naš tim javit će se čim oglasi budu objavljeni.`,
      projects: `**Naši projekti** 🏗️

Na dalmatinskoj obali:

- **Marina Residence** — apartmani s pogledom na more
- **Villa Marina** — dvoetažna vila s privatnim bazenom
- **Villa Bellamar** — moderna vila na obronku

Koji projekt želite istražiti?`,
      contact: `**Kontakt Bellamar** 📞

- 📍 Split, Hrvatska
- 📱 +385 95 374 4906
- ✉️ executive@bellamarinvest.com

Ostavite svoje **ime i e-mail** ispod i naš tim će vam se ubrzo javiti.`,
      lead: `Rado ću vas povezati s našim timom.

Podijelite svoje **ime**, **e-mail** i što vas zanima.`,
      fallback: `Mogu vam pomoći s:

- 🏠 **Nekretnine na prodaju**
- 🔑 **Najam**
- 🏗️ **Naši projekti**
- 📞 **Kontakt s našim timom**

Što želite istražiti?`,
    },
    leadFlow: {
      askName: "Rado ću vas povezati s našim timom. 😊\n\nKako se **zovete**?",
      askEmail: "Drago mi je, **{name}**! Na koji vas **e-mail** možemo kontaktirati?",
      askInterest: "Zabilježeno. A što vas **zanima**? _(određena nekretnina, najam, ulaganje…)_",
      emailInvalid: "Hmm, ovo ne izgleda kao ispravna e-mail adresa. 🙏 Možete li je ponovno upisati?",
      done: "**Hvala, {name}!** ✨\n\nNaš tim će vam se ubrzo javiti na **{email}** vezano uz **{interest}**.\n\nSlobodno me pitajte još nešto!",
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
    errorMessage: 'Przepraszam, mam teraz problem z połączeniem. Spróbuj ponownie za chwilę lub napisz do nas na **executive@bellamarinvest.com**.',
    offlineMessage: 'Nasz asystent jest obecnie offline. Skontaktuj się z nami pod adresem **executive@bellamarinvest.com** lub **+385 95 374 4906**.',
    quickReplies: [
      { id: 'sales', icon: '🏠', text: 'Nieruchomości na sprzedaż' },
      { id: 'rentals', icon: '🔑', text: 'Nieruchomości na wynajem' },
      { id: 'projects', icon: '🏗️', text: 'Nasze projekty' },
      { id: 'contact', icon: '📞', text: 'Kontakt i oglądanie' },
    ],
    answers: {
      sales: `**Nieruchomości na sprzedaż** 🏠

Ekskluzywne apartamenty w **Marinie, Dalmacja** _(30 min od Splitu)_:

- **Skyline Penthouse Marina** — dwupoziomowy · 4 sypialnie · widok na morze
- **Nowoczesny apartament z 1 sypialnią** — najlepsza cena · gotowy do wprowadzenia
- **Rezydencje z widokiem na morze** — prywatny parking i schowek

Chcesz szczegóły konkretnej nieruchomości, czy mam umówić **oglądanie**?`,
      rentals: `**Wynajem** 🔑

Nasza oferta wynajmu będzie dostępna **wkrótce**.

Powiedz mi, czego szukasz — terminy, wielkość, budżet — a zanotuję Twoje zainteresowanie. Nasz zespół odezwie się, gdy oferty będą dostępne.`,
      projects: `**Nasze projekty** 🏗️

Na wybrzeżu Dalmacji:

- **Marina Residence** — apartamenty z widokiem na morze
- **Villa Marina** — dwupoziomowa willa z prywatnym basenem
- **Villa Bellamar** — nowoczesna willa na wzgórzu

Który projekt chcesz poznać?`,
      contact: `**Kontakt Bellamar** 📞

- 📍 Split, Chorwacja
- 📱 +385 95 374 4906
- ✉️ executive@bellamarinvest.com

Zostaw poniżej swoje **imię i e-mail**, a nasz zespół wkrótce się odezwie.`,
      lead: `Chętnie połączę Cię z naszym zespołem.

Podaj swoje **imię**, **e-mail** i czym jesteś zainteresowany.`,
      fallback: `Mogę pomóc Ci w zakresie:

- 🏠 **Nieruchomości na sprzedaż**
- 🔑 **Wynajem**
- 🏗️ **Nasze projekty**
- 📞 **Kontakt z naszym zespołem**

Co chcesz sprawdzić?`,
    },
    leadFlow: {
      askName: "Chętnie połączę Cię z naszym zespołem. 😊\n\nJak masz na **imię**?",
      askEmail: "Miło Cię poznać, **{name}**! Na jaki **e-mail** możemy się z Tobą skontaktować?",
      askInterest: "Zanotowane. A czym jesteś **zainteresowany**? _(konkretna nieruchomość, wynajem, inwestycja…)_",
      emailInvalid: "Hmm, to nie wygląda na prawidłowy adres e-mail. 🙏 Czy możesz wpisać go ponownie?",
      done: "**Dziękujemy, {name}!** ✨\n\nNasz zespół skontaktuje się z Tobą wkrótce pod adresem **{email}** w sprawie **{interest}**.\n\nŚmiało zadaj kolejne pytanie!",
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
