'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/lib/supabase/types'

const VALID: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export async function updateOrderStatus(id: string, status: string) {
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
