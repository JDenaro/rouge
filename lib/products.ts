import { createServerClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/supabase/types'

export const FEATURED_SLUGS = [
  'black-ritual-e7n3w',
  'dominia-7vjsb',
  'rockstar',
  'brillante',
] as const

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('slug', FEATURED_SLUGS as unknown as string[])
    .eq('active', true)
  if (error || !data) {
    if (error) console.error('getFeaturedProducts:', error)
    return []
  }
  const rows = data as unknown as Product[]
  // Preserve the order from FEATURED_SLUGS
  const bySlug = new Map(rows.map((p) => [p.slug, p]))
  return FEATURED_SLUGS.map((s) => bySlug.get(s)).filter(
    (p): p is Product => !!p,
  )
}

export async function getCategoryThumbnails(
  slugs: readonly string[],
): Promise<Record<string, string>> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('category, images')
    .in('category', slugs as string[])
    .eq('active', true)
  if (error || !data) {
    if (error) console.error('getCategoryThumbnails:', error)
    return {}
  }
  const rows = data as unknown as Array<{ category: string; images: string[] }>
  const result: Record<string, string> = {}
  for (const row of rows) {
    if (!result[row.category] && row.images?.[0]) {
      result[row.category] = row.images[0]
    }
  }
  return result
}

export function transferPrice(price: number): number {
  return Math.round(price * 0.88)
}
