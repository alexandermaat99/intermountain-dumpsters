import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

// Use service role key for server-side (Node.js) and anon key for client-side
const isServer = typeof window === 'undefined'
const supabaseKey = isServer ? supabaseServiceKey : supabaseAnonKey

if (!supabaseKey) {
  console.error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}) 