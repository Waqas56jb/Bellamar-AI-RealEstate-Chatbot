import { Router } from 'express'
import { getSettings } from '../settingsStore.js'

const router = Router()

// GET /api/settings  (PUBLIC — the chatbot widget reads this to know whether it
// is enabled, which theme to use, and the welcome message per language).
router.get('/', async (_req, res) => {
  try {
    const s = await getSettings()
    res.json({
      isEnabled: s.is_enabled,
      theme: s.theme,
      primaryLanguage: s.primary_language,
      welcome: {
        en: s.welcome_en,
        nl: s.welcome_nl,
        hr: s.welcome_hr,
        pl: s.welcome_pl,
      },
    })
  } catch (err) {
    console.error('[settings] error:', err?.message || err)
    res.status(500).json({ error: 'Could not load settings.' })
  }
})

export default router
