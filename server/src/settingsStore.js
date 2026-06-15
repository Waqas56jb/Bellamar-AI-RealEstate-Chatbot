import { supabase } from './supabaseClient.js'

// Bot settings live in a single row (id = 1) of public.bot_settings.

const ALLOWED_FIELDS = [
  'is_enabled',
  'theme',
  'primary_language',
  'welcome_en',
  'welcome_nl',
  'welcome_hr',
  'welcome_pl',
]

export async function getSettings() {
  const { data, error } = await supabase
    .from('bot_settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) throw error
  return data
}

export async function updateSettings(patch = {}) {
  const update = {}
  for (const key of ALLOWED_FIELDS) {
    if (key in patch) update[key] = patch[key]
  }
  const { data, error } = await supabase
    .from('bot_settings')
    .update(update)
    .eq('id', 1)
    .select()
    .single()
  if (error) throw error
  return data
}

// The welcome message for a given language, falling back to English.
export function welcomeFor(settings, lang) {
  return settings?.[`welcome_${lang}`] || settings?.welcome_en || ''
}
