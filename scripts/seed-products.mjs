/**
 * Seed Supabase `products` table with scraped data from rougeintime.ar.
 *
 * Run with:
 *   node --env-file=.env.local scripts/seed-products.mjs
 *
 * Reads scripts/products-enriched.json and upserts by slug.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import ws from 'ws'

const __dirname = dirname(fileURLToPath(import.meta.url))
const JSON_PATH = join(__dirname, 'products-enriched.json')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws },
})

const raw = JSON.parse(readFileSync(JSON_PATH, 'utf8'))

const rows = raw.map((p) => ({
  name: p.name,
  slug: p.slug,
  description: p.description ? p.description.slice(0, 800) : null,
  price: p.price,
  category: p.category,
  images: [p.image],
  sizes: [],
  colors: [],
  stock: 100,
  active: true,
}))

console.log(`Upserting ${rows.length} products…`)

// Upsert in chunks of 50 to stay well under any payload limits
const CHUNK = 50
let inserted = 0
for (let i = 0; i < rows.length; i += CHUNK) {
  const chunk = rows.slice(i, i + CHUNK)
  const { error, count } = await supabase
    .from('products')
    .upsert(chunk, { onConflict: 'slug', count: 'exact' })
  if (error) {
    console.error(`Chunk ${i / CHUNK + 1} failed:`, error)
    process.exit(1)
  }
  inserted += count ?? chunk.length
  console.log(`  ${i + chunk.length}/${rows.length}`)
}

console.log(`\n✅ Done — ${inserted} rows in products`)

// Quick sanity check
const { count, error: countErr } = await supabase
  .from('products')
  .select('*', { count: 'exact', head: true })
if (countErr) {
  console.error('count check failed:', countErr)
} else {
  console.log(`Total products in DB: ${count}`)
}
