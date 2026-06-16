import { Router } from 'express'
import { saveLead } from '../leadsStore.js'
import { sendLeadEmails } from '../email.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/leads  (PUBLIC — called by the chatbot lead form)
// Body: { name, email, interest?, language? }
router.post('/', async (req, res) => {
  try {
    const { name, email, interest, language } = req.body || {}

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Name is required.' })
    }
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ error: 'A valid email is required.' })
    }

    const lead = await saveLead({ name, email, interest, language })
    console.log('[lead] captured:', lead.name, lead.email)

    // IMPORTANT: await the email send before responding. On serverless (Vercel)
    // the function is frozen the instant the response is sent, which would kill
    // a fire-and-forget email. We await it (bounded by SMTP timeouts) so both
    // the team alert and the visitor confirmation actually go out.
    let emailResult = { sent: false }
    try {
      emailResult = await sendLeadEmails(lead)
    } catch (e) {
      console.warn('[lead] email send failed:', e?.message)
    }

    return res.status(201).json({ ok: true, lead, emailSent: emailResult.sent })
  } catch (err) {
    console.error('[leads] error:', err?.message || err)
    return res.status(500).json({ error: 'Could not save lead.' })
  }
})

export default router
