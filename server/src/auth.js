import crypto from 'node:crypto'
import { config } from './config.js'

// Lightweight stateless admin auth. Login verifies the password and returns a
// token = HMAC(password, secret). The middleware recomputes and compares, so no
// session storage is needed. Send it as `Authorization: Bearer <token>`.

export function makeToken() {
  return crypto
    .createHmac('sha256', config.adminTokenSecret)
    .update(String(config.adminPassword))
    .digest('hex')
}

export function verifyPassword(password) {
  return typeof password === 'string' && password === config.adminPassword
}

// Express middleware guarding admin routes.
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const expected = makeToken()
  // constant-time comparison
  const ok =
    token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  if (!ok) return res.status(401).json({ error: 'Unauthorized' })
  next()
}
