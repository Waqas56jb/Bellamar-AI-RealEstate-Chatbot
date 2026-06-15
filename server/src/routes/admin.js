import { Router } from 'express'
import { verifyPassword, makeToken, requireAdmin } from '../auth.js'
import { getLeads, updateLeadStatus, deleteLead } from '../leadsStore.js'
import { getSettings, updateSettings } from '../settingsStore.js'
import {
  listTraining,
  createTraining,
  updateTraining,
  deleteTraining,
} from '../trainingStore.js'
import { getStats } from '../conversationStore.js'

const router = Router()

// ---- Auth --------------------------------------------------------------------
// POST /api/admin/login  { password } -> { token }
router.post('/login', (req, res) => {
  const { password } = req.body || {}
  if (!verifyPassword(password)) {
    return res.status(401).json({ error: 'Invalid password.' })
  }
  return res.json({ token: makeToken() })
})

// Everything below requires a valid admin token.
router.use(requireAdmin)

// GET /api/admin/verify -> { ok: true }  (token check for the admin app)
router.get('/verify', (_req, res) => res.json({ ok: true }))

// ---- Dashboard ---------------------------------------------------------------
router.get('/stats', async (_req, res) => {
  try {
    res.json(await getStats())
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to load stats.' })
  }
})

// ---- Leads -------------------------------------------------------------------
router.get('/leads', async (req, res) => {
  try {
    res.json({ leads: await getLeads({ status: req.query.status }) })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to load leads.' })
  }
})

router.patch('/leads/:id', async (req, res) => {
  try {
    res.json({ lead: await updateLeadStatus(req.params.id, req.body?.status) })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to update lead.' })
  }
})

router.delete('/leads/:id', async (req, res) => {
  try {
    res.json(await deleteLead(req.params.id))
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to delete lead.' })
  }
})

// ---- Training documents ------------------------------------------------------
router.get('/training', async (_req, res) => {
  try {
    res.json({ documents: await listTraining() })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to load training.' })
  }
})

router.post('/training', async (req, res) => {
  try {
    const { title, content } = req.body || {}
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and content are required.' })
    }
    res.status(201).json({ document: await createTraining(req.body) })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to create document.' })
  }
})

router.patch('/training/:id', async (req, res) => {
  try {
    res.json({ document: await updateTraining(req.params.id, req.body) })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to update document.' })
  }
})

router.delete('/training/:id', async (req, res) => {
  try {
    res.json(await deleteTraining(req.params.id))
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to delete document.' })
  }
})

// ---- Settings ----------------------------------------------------------------
router.get('/settings', async (_req, res) => {
  try {
    res.json({ settings: await getSettings() })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to load settings.' })
  }
})

router.patch('/settings', async (req, res) => {
  try {
    res.json({ settings: await updateSettings(req.body) })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to update settings.' })
  }
})

export default router
