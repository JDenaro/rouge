import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Used in Server Components and API routes — uses the service role key
// NEVER import this file in client components
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
