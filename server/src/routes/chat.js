import { Router } from 'express'
import { getChatReply, streamChatReply } from '../openaiClient.js'
import { getSettings, welcomeFor } from '../settingsStore.js'
import { getActiveTraining } from '../trainingStore.js'
import { ensureConversation, logMessage } from '../conversationStore.js'

const router = Router()

// Normalize the request body into an OpenAI-style history array.
function readHistory(body) {
  const { messages, message } = body || {}
  if (Array.isArray(messages) && messages.length) return messages
  if (typeof message === 'string' && message.trim()) return [{ role: 'user', content: message.trim() }]
  return null
}

// POST /api/chat/stream  — streams the reply token-by-token as plain text.
// The conversation id is returned in the `X-Conversation-Id` response header.
router.post('/stream', async (req, res) => {
  try {
    const { language = 'en', conversationId } = req.body || {}
    const history = readHistory(req.body)
    if (!history) return res.status(400).json({ error: 'Provide "messages" array or "message" string.' })

    // Fetch settings, training, and ensure a conversation — in parallel to cut latency.
    const [settings, training, convId] = await Promise.all([
      getSettings().catch(() => null),
      getActiveTraining(language).catch(() => []),
      ensureConversation(conversationId, { language }).catch(() => conversationId || null),
    ])

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('X-Accel-Buffering', 'no') // hint proxies not to buffer
    if (convId) res.setHeader('X-Conversation-Id', convId)

    // Respect the admin on/off switch.
    if (settings && settings.is_enabled === false) {
      res.write(
        welcomeFor(settings, language) ||
          'Our assistant is currently offline. Please contact us at executive@bellamarinvest.com.',
      )
      return res.end()
    }

    const full = await streamChatReply(history, language, training, (delta) => res.write(delta))
    res.end()

    // Log the turn for analytics (best-effort, after the stream finishes).
    try {
      const lastUser = [...history].reverse().find((m) => m.role !== 'assistant')
      if (lastUser) await logMessage(convId, 'user', String(lastUser.content || ''))
      await logMessage(convId, 'assistant', full)
    } catch (e) {
      console.warn('[chat/stream] logging skipped:', e?.message || e)
    }
  } catch (err) {
    console.error('[chat/stream] error:', err?.message || err)
    if (!res.headersSent) res.status(500).json({ error: 'Chat service error. Please try again.' })
    else res.end()
  }
})

// POST /api/chat  — non-streaming fallback. Returns { reply, conversationId, disabled? }
router.post('/', async (req, res) => {
  try {
    const { language = 'en', conversationId } = req.body || {}
    const history = readHistory(req.body)
    if (!history) return res.status(400).json({ error: 'Provide "messages" array or "message" string.' })

    const settings = await getSettings().catch(() => null)
    if (settings && settings.is_enabled === false) {
      return res.json({
        disabled: true,
        reply:
          welcomeFor(settings, language) ||
          'Our assistant is currently offline. Please contact us at executive@bellamarinvest.com.',
      })
    }

    const training = await getActiveTraining(language).catch(() => [])
    const reply = await getChatReply(history, language, training)

    let convId = conversationId
    try {
      convId = await ensureConversation(conversationId, { language })
      const lastUser = [...history].reverse().find((m) => m.role !== 'assistant')
      if (lastUser) await logMessage(convId, 'user', String(lastUser.content || ''))
      await logMessage(convId, 'assistant', reply)
    } catch (logErr) {
      console.warn('[chat] logging skipped:', logErr?.message || logErr)
    }

    return res.json({ reply, conversationId: convId })
  } catch (err) {
    console.error('[chat] error:', err?.message || err)
    return res.status(err?.status || 500).json({ error: 'Chat service error. Please try again.' })
  }
})

export default router
