// API client for the chatbot widget -> backend.
// Defaults to the deployed backend; override with VITE_API_URL for local dev.
const BASE = (
  import.meta.env.VITE_API_URL || 'https://bellamar-ai-real-estate-chatbot-bac.vercel.app'
).replace(/\/$/, '')

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const api = {
  // Send conversation history; returns { reply, conversationId, disabled? }
  chat: ({ messages, language, conversationId }) =>
    post('/api/chat', { messages, language, conversationId }),

  // Streaming chat: calls onToken(fullTextSoFar) as tokens arrive.
  // Returns { reply, conversationId }.
  chatStream: async ({ messages, language, conversationId, onToken }) => {
    const res = await fetch(`${BASE}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, language, conversationId }),
    })
    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || `Stream failed (${res.status})`)
    }
    const convId = res.headers.get('X-Conversation-Id') || conversationId || null
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let full = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      full += decoder.decode(value, { stream: true })
      onToken?.(full)
    }
    return { reply: full.trim(), conversationId: convId }
  },

  // Save a captured lead -> { ok, lead }
  sendLead: (lead) => post('/api/leads', lead),

  // Public widget settings (enabled flag, theme, welcome messages)
  getSettings: async () => {
    const res = await fetch(`${BASE}/api/settings`)
    if (!res.ok) throw new Error(`Settings failed (${res.status})`)
    return res.json()
  },
}
