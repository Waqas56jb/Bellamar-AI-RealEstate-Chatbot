import { supabase } from './supabaseClient.js'

// CRUD for admin-managed training documents (public.training_documents).

export async function listTraining() {
  const { data, error } = await supabase
    .from('training_documents')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Active docs (optionally for a language) — used to enrich the chat prompt.
export async function getActiveTraining(lang) {
  let query = supabase.from('training_documents').select('title, content, language').eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return (data || []).filter((d) => d.language === 'all' || d.language === lang)
}

export async function createTraining({ title, content, language = 'all', is_active = true }) {
  const { data, error } = await supabase
    .from('training_documents')
    .insert({ title, content, language, is_active })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTraining(id, patch = {}) {
  const update = {}
  for (const key of ['title', 'content', 'language', 'is_active']) {
    if (key in patch) update[key] = patch[key]
  }
  const { data, error } = await supabase
    .from('training_documents')
    .update(update)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTraining(id) {
  const { error } = await supabase.from('training_documents').delete().eq('id', id)
  if (error) throw error
  return { ok: true }
}
