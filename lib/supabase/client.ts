import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Used in Client Components — uses the public anon key
export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
