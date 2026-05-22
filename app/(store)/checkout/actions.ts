'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { CartItem } from '@/components/store/CartContext'

export type CheckoutFormData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
}

const TRANSFER_DISCOUNT = 0.88

function validate(data: CheckoutFormData): string | null {
  if (!data.customerName.trim()) return 'Necesitamos tu nombre'
  if (!data.customerEmail.trim()) return 'Necesitamos tu email'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) return 'Email inválido'
  if (!data.customerPhone.trim()) return 'Necesitamos un WhatsApp para coordinar el envío'
  return null
}

export async function createOrder(
  items: CartItem[],
  data: CheckoutFormData,
): Promise<{ ok: false; error: string } | { ok: true; orderId: string }> {
  if (items.length === 0) {
    return { ok: false, error: 'Tu carrito está vacío' }
  }
  const err = validate(data)
  if (err) return { ok: false, error: err }

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const total = Math.round(subtotal * TRANSFER_DISCOUNT)

  const supabase = createServerClient()
  const orderRow = {
    status: 'pending' as const,
    customer_name: data.customerName.trim(),
    customer_email: data.customerEmail.trim().toLowerCase(),
    customer_phone: data.customerPhone.trim(),
    items: items.map((i) => ({
      product_id: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      image: i.image,
    })),
    subtotal,
    total,
    notes: data.notes.trim() || null,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: row, error } = await (supabase.from('orders') as any)
    .insert(orderRow)
    .select('id')
    .single()

  if (error || !row) {
    console.error('createOrder:', error)
    return { ok: false, error: 'No pudimos crear tu orden. Probá de nuevo.' }
  }

  const orderId = (row as unknown as { id: string }).id
  redirect(`/checkout/confirmacion?o=${orderId}`)
}
