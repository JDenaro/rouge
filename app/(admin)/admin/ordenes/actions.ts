'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth'
import type { OrderStatus } from '@/lib/supabase/types'

async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  const session = token ? await verifyAdminToken(token) : null
  if (!session) throw new Error('No autorizado')
}

const VALID: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin()
  if (!(VALID as string[]).includes(status)) {
    return { ok: false as const, error: 'Estado inválido' }
  }
  const supabase = createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('orders') as any).update({ status }).eq('id', id)
  if (error) {
    console.error('updateOrderStatus:', error)
    return { ok: false as const, error: error.message }
  }
  revalidatePath('/admin/ordenes')
  revalidatePath('/admin')
  return { ok: true as const }
}
