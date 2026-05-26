'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { OrderItem, Product } from '@/lib/supabase/types'

const TRANSFER_DISCOUNT = 0.88
const MAX_LINE_QTY = 20

export type CartLineInput = {
  productId: string
  quantity: number
  size: string
  color: string
}

export type CheckoutFormData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
}

function validateForm(data: CheckoutFormData): string | null {
  if (!data.customerName.trim()) return 'Necesitamos tu nombre'
  if (!data.customerEmail.trim()) return 'Necesitamos tu email'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) return 'Email inválido'
  if (!data.customerPhone.trim()) return 'Necesitamos un WhatsApp para coordinar el envío'
  return null
}

function validateLines(lines: CartLineInput[]): string | null {
  if (lines.length === 0) return 'Tu carrito está vacío'
  for (const l of lines) {
    if (!l.productId || typeof l.productId !== 'string') return 'Producto inválido'
    if (!Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > MAX_LINE_QTY) {
      return 'Cantidad inválida'
    }
    if (typeof l.size !== 'string' || typeof l.color !== 'string') {
      return 'Talle o color inválido'
    }
  }
  return null
}

type ProductSnapshot = Pick<
  Product,
  'id' | 'name' | 'slug' | 'price' | 'images' | 'stock' | 'active'
>

export async function createOrder(
  lines: CartLineInput[],
  data: CheckoutFormData,
): Promise<{ ok: false; error: string } | { ok: true; orderId: string }> {
  const formErr = validateForm(data)
  if (formErr) return { ok: false, error: formErr }

  const linesErr = validateLines(lines)
  if (linesErr) return { ok: false, error: linesErr }

  const supabase = createServerClient()
  const ids = [...new Set(lines.map((l) => l.productId))]

  const { data: products, error: lookupErr } = await supabase
    .from('products')
    .select('id, name, slug, price, images, stock, active')
    .in('id', ids)

  if (lookupErr || !products) {
    console.error('createOrder lookup:', lookupErr)
    return { ok: false, error: 'No pudimos validar tu carrito. Probá de nuevo.' }
  }

  const byId = new Map(
    (products as unknown as ProductSnapshot[]).map((p) => [p.id, p]),
  )

  const orderItems: OrderItem[] = []
  let subtotal = 0

  for (const line of lines) {
    const p = byId.get(line.productId)
    if (!p) return { ok: false, error: 'Un producto de tu carrito ya no está disponible' }
    if (!p.active) return { ok: false, error: `"${p.name}" ya no está disponible` }
    if (p.stock < line.quantity) {
      return { ok: false, error: `Solo quedan ${p.stock} unidades de "${p.name}"` }
    }

    const lineTotal = p.price * line.quantity
    subtotal += lineTotal

    orderItems.push({
      product_id: p.id,
      name: p.name,
      price: p.price,
      quantity: line.quantity,
      size: line.size,
      color: line.color,
      image: p.images?.[0] ?? '',
    })
  }

  const total = Math.round(subtotal * TRANSFER_DISCOUNT)

  const orderRow = {
    status: 'pending' as const,
    customer_name: data.customerName.trim(),
    customer_email: data.customerEmail.trim().toLowerCase(),
    customer_phone: data.customerPhone.trim(),
    items: orderItems,
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
    console.error('createOrder insert:', error)
    return { ok: false, error: 'No pudimos crear tu orden. Probá de nuevo.' }
  }

  const orderId = (row as unknown as { id: string }).id
  redirect(`/checkout/confirmacion?o=${orderId}`)
}
