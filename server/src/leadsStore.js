import { supabase } from './supabaseClient.js'

// Lead persistence backed by Supabase (table: public.leads).

export async function saveLead(lead) {
  const row = {
    name: String(lead.name || '').trim(),
    email: String(lead.email || '').trim(),
    interest: String(lead.interest || '').trim() || null,
    language: String(lead.language || 'en').trim(),
    source: String(lead.source || 'chatbot').trim(),
  }
  const { data, error } = await supabase.from('leads').insert(row).select().single()
  if (error) throw error
  return data
}

export async function getLeads({ status } = {}) {
  let query = supabase.from('leads').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateLeadStatus(id, status) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteLead(id) {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
  return { ok: true }
}
