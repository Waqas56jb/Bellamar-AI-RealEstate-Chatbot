# Bellamar Housing — Chatbot Frontend (React + Vite)

Premium AI chatbot widget for **bellamar-invest.com** (Croatian / Adriatic
real estate, Split). Frontend only — bot replies are mocked locally so the UI
is fully demonstrable before the AI backend is connected.

## Features
- Welcome screen → "Start Conversation" → live chat (matches approved design)
- Quick-reply menu: Sales, Rentals, Projects, Contact (real site content)
- Inline lead capture (name, email, interest)
- Multilingual: **EN / NL / HR / PL** (switch in header)
- Floating launcher bubble + open panel, fully mobile responsive

## Run locally
```bash
cd client
npm install
npm run dev        # opens http://localhost:5173
```

## Build
```bash
npm run build      # output in client/dist
```

## Project structure
```
src/
  App.jsx                 demo host page
  data/content.js         all copy + translations + mock answer router
  components/
    ChatWidget.jsx        state + launcher/panel
    Header.jsx            brand, status, language switch, close
    WelcomeScreen.jsx     landing view
    ChatScreen.jsx        message list + input
    MessageBubble.jsx     bot/user bubble
    QuickReplies.jsx      option cards
    LeadForm.jsx          inline lead capture
    TypingIndicator.jsx   typing dots
```

## Next step (backend)
Replace the mocked `botReply` in `ChatWidget.jsx` with a call to the AI backend
(`server/`), and POST captured leads from `handleLead` to the leads API.
