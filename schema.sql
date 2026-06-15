-- =============================================================================
-- Bellamar Housing — AI Chatbot database schema (PostgreSQL / Supabase)
--
-- HOW TO RUN:
--   Supabase Dashboard -> SQL Editor -> New query -> paste this file -> Run.
--   Safe to run more than once (uses IF NOT EXISTS / ON CONFLICT).
--
-- SECURITY MODEL:
--   Row Level Security is enabled on every table with NO public policies.
--   That means the anon / publishable key cannot read or write anything.
--   The backend (server/) connects with the SECRET key, which bypasses RLS,
--   so all access goes through our own API + admin auth.
-- =============================================================================

-- gen_random_uuid()
create extension if not exists "pgcrypto";

-- auto-update updated_at on row changes
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- -----------------------------------------------------------------------------
-- LEADS  (lead management dashboard)
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  interest    text,
  language    text not null default 'en',
  source      text not null default 'chatbot',
  status      text not null default 'new',         -- new | contacted | closed
  created_at  timestamptz not null default now()
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- -----------------------------------------------------------------------------
-- CONVERSATIONS + MESSAGES  (chat history / analytics)
-- -----------------------------------------------------------------------------
create table if not exists public.conversations (
  id          uuid primary key default gen_random_uuid(),
  language    text not null default 'en',
  visitor_id  text,                                 -- anonymous client id
  created_at  timestamptz not null default now()
);
create index if not exists conversations_created_at_idx on public.conversations (created_at desc);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid references public.conversations(id) on delete cascade,
  role             text not null check (role in ('user', 'assistant', 'system')),
  content          text not null,
  created_at       timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages (conversation_id);
create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- -----------------------------------------------------------------------------
-- TRAINING DOCUMENTS  (chatbot training panel)
-- Admin-editable knowledge appended to the system prompt at runtime.
-- -----------------------------------------------------------------------------
create table if not exists public.training_documents (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  language    text not null default 'all',          -- all | en | nl | hr | pl
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists training_active_idx on public.training_documents (is_active);

drop trigger if exists training_updated_at on public.training_documents;
create trigger training_updated_at
  before update on public.training_documents
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- BOT SETTINGS  (on/off switch, theme, welcome messages) — single row (id = 1)
-- -----------------------------------------------------------------------------
create table if not exists public.bot_settings (
  id                integer primary key default 1,
  is_enabled        boolean not null default true,
  theme             text not null default 'adriatic',   -- adriatic | midnight | sand
  primary_language  text not null default 'en',
  welcome_en        text default 'Hello! 👋 Welcome to Bellamar — your trusted partner in Croatian real estate. How can I help you today? ✨',
  welcome_nl        text default 'Hallo! 👋 Welkom bij Bellamar — uw vertrouwde partner in Kroatisch vastgoed. Hoe kan ik u vandaag helpen? ✨',
  welcome_hr        text default 'Pozdrav! 👋 Dobrodošli u Bellamar — vaš pouzdani partner za hrvatske nekretnine. Kako vam mogu pomoći danas? ✨',
  welcome_pl        text default 'Cześć! 👋 Witamy w Bellamar — Twoim zaufanym partnerze na rynku chorwackich nieruchomości. Jak mogę dziś pomóc? ✨',
  updated_at        timestamptz not null default now(),
  constraint bot_settings_single_row check (id = 1)
);
insert into public.bot_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists bot_settings_updated_at on public.bot_settings;
create trigger bot_settings_updated_at
  before update on public.bot_settings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY (deny all by default; backend uses secret key)
-- -----------------------------------------------------------------------------
alter table public.leads               enable row level security;
alter table public.conversations       enable row level security;
alter table public.messages            enable row level security;
alter table public.training_documents  enable row level security;
alter table public.bot_settings        enable row level security;

-- No policies are created on purpose: the anon/publishable key has zero access.
-- The backend secret key bypasses RLS for all server-side operations.
