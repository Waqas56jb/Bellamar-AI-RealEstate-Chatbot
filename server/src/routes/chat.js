import { Router } from 'express'
import { getChatReply } from '../openaiClient.js'
import { getSettings, welcomeFor } from '../settingsStore.js'
import { getActiveTraining } from '../trainingStore.js'
import { ensureConversation, logMessage } from '../conversationStore.js'

const router = Router()

// POST /api/chat
// Body: { messages|message, language?, conversationId?, visitorId? }
// Returns: { reply, conversationId, disabled? }
router.post('/', async (req, res) => {
  try {
    const { messages, message, language = 'en', conversationId, visitorId } = req.body || {}

    let history = []
    if (Array.isArray(messages) && messages.length) {
      history = messages
    } else if (typeof message === 'string' && message.trim()) {
      history = [{ role: 'user', content: message.trim() }]
    } else {
      return res.status(400).json({ error: 'Provide "messages" array or "message" string.' })
    }

    // Respect the admin on/off switch.
    const settings = await getSettings().catch(() => null)
    if (settings && settings.is_enabled === false) {
      return res.json({
        disabled: true,
        reply: welcomeFor(settings, language) ||
          'Our assistant is currently offline. Please contact us at executive@bellamarinvest.com.',
      })
    }

    // Enrich the prompt with admin training docs.
    const training = await getActiveTraining(language).catch(() => [])

    const reply = await getChatReply(history, language, training)

    // Log conversation + last exchange for analytics (best-effort).
    let convId = conversationId
    try {
      convId = await ensureConversation(conversationId, { language, visitorId })
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
