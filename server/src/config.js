import 'dotenv/config'

// -----------------------------------------------------------------------------
// All tunables live here and are HARDCODED on purpose. Only secrets/connection
// values come from the environment (server/.env).
// -----------------------------------------------------------------------------

export const config = {
  // Secrets from .env
  openaiApiKey: process.env.OPENAI_API_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminTokenSecret: process.env.ADMIN_TOKEN_SECRET || 'dev-insecure-secret',

  // Server
  port: 3001,

  // OpenAI model + generation params (change here, not in .env)
  model: 'gpt-4o-mini',
  temperature: 0.4,
  maxTokens: 600,

  // How many past turns to keep when sending history to the model
  maxHistoryMessages: 12,

  // Supported chatbot languages (must match the frontend)
  languages: {
    en: 'English',
    nl: 'Dutch (Nederlands)',
    hr: 'Croatian (Hrvatski)',
    pl: 'Polish (Polski)',
  },
}

// Fail fast with a clear message if required values are missing.
export function assertConfig() {
  const missing = []
  if (!config.openaiApiKey) missing.push('OPENAI_API_KEY')
  if (!config.supabaseUrl) missing.push('SUPABASE_URL')
  if (!config.supabaseSecretKey) missing.push('SUPABASE_SECRET_KEY')
  if (!config.adminPassword) missing.push('ADMIN_PASSWORD')
  if (missing.length) {
    throw new Error(
      `Missing required env var(s): ${missing.join(', ')}. See server/.env.example.`,
    )
  }
}
