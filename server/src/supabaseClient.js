import { createClient } from '@supabase/supabase-js'
import { config } from './config.js'

// Server-side Supabase client. Uses the SECRET key, so it bypasses Row Level
// Security — all access is gated by our own API/auth, never exposed to browsers.
export const supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
