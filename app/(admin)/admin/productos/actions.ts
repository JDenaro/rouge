'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth'

async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  const session = token ? await verifyAdminToken(token) : null
  if (!session) throw new Error('No autorizado')
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireAdmin()
  const supabase = createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('products') as any)
    .update({ active })
    .eq('id', id)
  if (error) {
    console.error('toggleProductActive:', error)
    return { ok: false as const, error: error.message }
  }
  revalidatePath('/admin/productos')
  revalidatePath('/')
  return { ok: true as const }
}

export async function updateProductPrice(id: string, price: number) {
  await requireAdmin()
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false as const, error: 'Precio inválido' }
  }
  const supabase = createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('products') as any).update({ price }).eq('id', id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath('/admin/productos')
  return { ok: true as const }
}
