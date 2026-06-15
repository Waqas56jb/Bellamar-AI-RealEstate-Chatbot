# Bellamar Housing — Chatbot Admin Panel (React + Vite)

Control panel for the Bellamar chatbot. Talks to the backend (`server/`) API.

## Features
- **Login** — password-protected (set `ADMIN_PASSWORD` in `server/.env`)
- **Dashboard** — leads, conversations, messages stats
- **Leads** — manage captured leads (status: new / contacted / closed, delete)
- **Training** — add/edit knowledge the AI uses live (per language, on/off)
- **Settings** — chatbot on/off switch, theme, default language, welcome messages

## Run
```bash
cd admin
npm install
npm run dev        # http://localhost:5174
```
The backend must be running (`cd server && npm start`). Override the API URL
with `VITE_API_URL` in `admin/.env` if needed (default `http://localhost:3001`).

> First time: run `schema.sql` in the Supabase SQL Editor so the tables exist.
> Default login password is whatever you set in `server/.env` → `ADMIN_PASSWORD`.
