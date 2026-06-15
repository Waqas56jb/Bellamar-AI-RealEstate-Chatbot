import { supabase } from './supabaseClient.js'

// Conversation + message logging for analytics (public.conversations / messages).

export async function ensureConversation(conversationId, { language, visitorId } = {}) {
  if (conversationId) return conversationId
  const { data, error } = await supabase
    .from('conversations')
    .insert({ language: language || 'en', visitor_id: visitorId || null })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

export async function logMessage(conversationId, role, content) {
  if (!conversationId) return
  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content })
  if (error) throw error
}

// Aggregate stats for the admin dashboard.
export async function getStats() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [leadsAll, leads7d, convAll, msgAll] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', since),
    supabase.from('conversations').select('id', { count: 'exact', head: true }),
    supabase.from('messages').select('id', { count: 'exact', head: true }),
  ])

  return {
    totalLeads: leadsAll.count ?? 0,
    leadsLast7Days: leads7d.count ?? 0,
    totalConversations: convAll.count ?? 0,
    totalMessages: msgAll.count ?? 0,
  }
}
