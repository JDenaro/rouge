import { createServerClient } from '@/lib/supabase/server'
import type { Product, ProductCategory } from '@/lib/supabase/types'

export const FEATURED_SLUGS = [
  'black-ritual-e7n3w',
  'dominia-7vjsb',
  'rockstar',
  'brillante',
] as const

export const CATEGORY_META: Record<
  ProductCategory,
  { label: string; description: string }
> = {
  sets: { label: 'Sets', description: '3 y 4 piezas' },
  'baby-doll': { label: 'Baby Doll', description: 'Romántico y sensual' },
  body: { label: 'Body', description: 'Para usar bajo o sobre' },
  bata: { label: 'Bata', description: 'Salida ligera' },
  corsets: { label: 'Corsets', description: 'Estructura y forma' },
  pijamas: { label: 'Pijamas', description: 'Confort a medida' },
  disfraces: { label: 'Disfraces', description: 'Fantasía y juego' },
  sexshop: { label: 'Sexshop', description: 'Bienestar íntimo' },
  conjuntos: { label: 'Conjuntos', description: 'Pares y duplas' },
  catsuit: { label: 'Catsuit', description: 'Segunda piel' },
  'perfume-feromonas': { label: 'Perfumes', description: 'Feromonas y body sprays' },
  'panty-vedetina-culotte': { label: 'Panties', description: 'Vedetinas y culottes' },
}

export type CategorySizesConfig = {
  corpino: boolean
  pantalon: boolean
  aMedida: boolean
}

export const CATEGORY_SIZES: Record<ProductCategory, CategorySizesConfig> = {
  sets:                     { corpino: true,  pantalon: true,  aMedida: true  },
  'baby-doll':              { corpino: true,  pantalon: true,  aMedida: true  },
  body:                     { corpino: true,  pantalon: true,  aMedida: true  },
  catsuit:                  { corpino: true,  pantalon: true,  aMedida: true  },
  conjuntos:                { corpino: true,  pantalon: true,  aMedida: true  },
  corsets:                  { corpino: true,  pantalon: true,  aMedida: true  },
  bata:                     { corpino: true,  pantalon: true,  aMedida: true  },
  pijamas:                  { corpino: true,  pantalon: true,  aMedida: true  },
  disfraces:                { corpino: true,  pantalon: true,  aMedida: true  },
  'panty-vedetina-culotte': { corpino: false, pantalon: true,  aMedida: true  },
  sexshop:                  { corpino: false, pantalon: false, aMedida: false },
  'perfume-feromonas':      { corpino: false, pantalon: false, aMedida: false },
}

export const VALID_CATEGORIES = Object.keys(CATEGORY_META) as ProductCategory[]

export function isValidCategory(s: string): s is ProductCategory {
  return (VALID_CATEGORIES as string[]).includes(s)
}

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
  const bySlug = new Map(rows.map((p) => [p.slug, p]))
  return FEATURED_SLUGS.map((s) => bySlug.get(s)).filter(
    (p): p is Product => !!p,
  )
}

// Image filename fragments to exclude — products whose photos have promotional/text
// watermarks baked in and look out of place as category thumbnails.
const THUMBNAIL_EXCLUDED_IMAGE_PATTERNS = [
  'captura-de-pantalla-2023-11-16-105109', // "It's magic!" glitter body oil
  'imagen-de-whatsapp-2024-11-21-a-las-10-33-17', // "Felices Fiestas" promo
]

function isExcludedImage(url: string): boolean {
  return THUMBNAIL_EXCLUDED_IMAGE_PATTERNS.some((p) => url.includes(p))
}

export type CategoryMeta = { image: string; minPrice: number }

export async function getCategoryThumbnails(
  slugs: readonly string[],
): Promise<Record<string, CategoryMeta>> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('category, images, price')
    .in('category', slugs as string[])
    .eq('active', true)
  if (error || !data) {
    if (error) console.error('getCategoryThumbnails:', error)
    return {}
  }
  const rows = data as unknown as Array<{
    category: string
    images: string[]
    price: number
  }>
  const result: Record<string, CategoryMeta> = {}
  for (const row of rows) {
    const existing = result[row.category]
    const firstImage = row.images?.[0]
    if (!existing && firstImage && !isExcludedImage(firstImage)) {
      result[row.category] = { image: firstImage, minPrice: row.price }
    } else if (existing && typeof row.price === 'number') {
      if (row.price < existing.minPrice) {
        result[row.category] = { ...existing, minPrice: row.price }
      }
    }
  }
  return result
}

export type CatalogFilters = {
  category?: ProductCategory
  sort?: 'price-asc' | 'price-desc' | 'name'
}

export async function getCatalog(filters: CatalogFilters = {}): Promise<Product[]> {
  const supabase = createServerClient()
  let query = supabase.from('products').select('*').eq('active', true)
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  switch (filters.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }
  const { data, error } = await query
  if (error || !data) {
    if (error) console.error('getCatalog:', error)
    return []
  }
  return data as unknown as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()
  if (error) {
    console.error('getProductBySlug:', error)
    return null
  }
  return (data as unknown as Product) ?? null
}

export async function getRelatedProducts(
  category: string,
  excludeSlug: string,
  limit = 4,
): Promise<Product[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .neq('slug', excludeSlug)
    .limit(limit)
  if (error || !data) return []
  return data as unknown as Product[]
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('active', true)
  if (error || !data) return {}
  const rows = data as unknown as Array<{ category: string }>
  const counts: Record<string, number> = {}
  for (const row of rows) {
    counts[row.category] = (counts[row.category] ?? 0) + 1
  }
  return counts
}

export function transferPrice(price: number): number {
  return Math.round(price * 0.88)
}
