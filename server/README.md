# Bellamar Housing — Chatbot Backend API (Node + Express + OpenAI)

AI backend for the Bellamar real-estate chatbot. The assistant is grounded on
Bellamar's own content (sales, projects, rentals, contact) and replies in the
visitor's language (EN / NL / HR / PL).

## Setup
```bash
cd server
npm install
# put your key in .env  ->  OPENAI_API_KEY=sk-...
npm start            # or: npm run dev  (auto-restart)
```
Runs on `http://localhost:3001`.

> Only `OPENAI_API_KEY` lives in `.env`. The model, temperature, token limit
> and system prompt are all hardcoded in `src/config.js` and `src/knowledge.js`.

## Endpoints

### `GET /api/health`
Health check → `{ status: "ok", model }`.

### `POST /api/chat`
```json
{
  "messages": [
    { "role": "user", "content": "Do you have apartments with sea views?" }
  ],
  "language": "en"
}
```
→ `{ "reply": "..." }`
You can also send `{ "message": "hi", "language": "nl" }` for a single turn.

### `POST /api/leads`
```json
{ "name": "Mario", "email": "mario@example.com", "interest": "Skyline Penthouse", "language": "en" }
```
→ `{ "ok": true, "lead": { ... } }`
Stored in `data/leads.json` (swap for a DB later — same route).

### `GET /api/leads`
Returns all captured leads (for the future admin panel).

## Config (hardcoded — `src/config.js`)
| Setting      | Value         |
|--------------|---------------|
| model        | `gpt-4o-mini` |
| temperature  | `0.4`         |
| max tokens   | `600`         |
| port         | `3001`        |

## Next step
Wire the frontend (`client/`) to call `POST /api/chat` instead of the mocked
replies, and `POST /api/leads` from the lead form.
