import express from 'express'
import cors from 'cors'
import { config, assertConfig } from './config.js'
import chatRoutes from './routes/chat.js'
import leadsRoutes from './routes/leads.js'
import settingsRoutes from './routes/settings.js'
import adminRoutes from './routes/admin.js'

assertConfig() // throws early if required env vars are missing

const app = express()

// Widget (client) + admin panel call this API from other origins.
// Expose the conversation-id header so the streaming client can read it.
app.use(cors({ exposedHeaders: ['X-Conversation-Id'] }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: config.model })
})

// Public (chatbot widget)
app.use('/api/chat', chatRoutes)
app.use('/api/leads', leadsRoutes)
app.use('/api/settings', settingsRoutes)

// Admin panel (login + protected routes)
app.use('/api/admin', adminRoutes)

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(config.port, () => {
  console.log(`Bellamar chatbot API running on http://localhost:${config.port}`)
  console.log(`Model: ${config.model}`)
})
