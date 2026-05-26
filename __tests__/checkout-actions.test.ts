import { describe, it, expect, vi, beforeEach } from 'vitest'

const insertCalls: Array<Record<string, unknown>> = []

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    const err = new Error(`NEXT_REDIRECT:${url}`)
    ;(err as Error & { digest: string }).digest = 'NEXT_REDIRECT'
    throw err
  },
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: () => ({
    from: (table: string) => {
      if (table === 'products') {
        return {
          select: () => ({
            in: () =>
              Promise.resolve({
                data: [
                  {
                    id: 'p1',
                    name: 'Set Rojo',
                    slug: 'set-rojo',
                    price: 50000,
                    images: ['https://cdn/x.webp'],
                    stock: 10,
                    active: true,
                  },
                  {
                    id: 'p2',
                    name: 'Body Negro',
                    slug: 'body-negro',
                    price: 30000,
                    images: ['https://cdn/y.webp'],
                    stock: 0,
                    active: true,
                  },
                  {
                    id: 'p3',
                    name: 'Inactivo',
                    slug: 'inactivo',
                    price: 99000,
                    images: [],
                    stock: 5,
                    active: false,
                  },
                ],
                error: null,
              }),
          }),
        }
      }
      if (table === 'orders') {
        return {
          insert: (row: Record<string, unknown>) => {
            insertCalls.push(row)
            return {
              select: () => ({
                single: () =>
                  Promise.resolve({ data: { id: 'order-abc' }, error: null }),
              }),
            }
          },
        }
      }
      throw new Error(`unexpected table ${table}`)
    },
  }),
}))

const validForm = {
  customerName: 'Ana López',
  customerEmail: 'ana@test.com',
  customerPhone: '+541112345678',
  notes: '',
}

beforeEach(() => {
  insertCalls.length = 0
})

describe('createOrder', () => {
  it('ignores client-supplied price and uses the DB price', async () => {
    const { createOrder } = await import('@/app/(store)/checkout/actions')

    // Cliente intenta inyectar un precio falso por medio de campos extra.
    // El cast confirma que aunque el payload del cliente traiga `price`/`name`,
    // el server los ignora.
    const malicious = [
      {
        productId: 'p1',
        quantity: 2,
        size: 'M',
        color: 'rojo',
        price: 1,
        name: 'Producto Falso',
      },
    ] as unknown as Array<{
      productId: string
      quantity: number
      size: string
      color: string
    }>

    await expect(createOrder(malicious, validForm)).rejects.toThrow(/NEXT_REDIRECT/)

    expect(insertCalls).toHaveLength(1)
    const row = insertCalls[0]

    // Server recalcula con price=50000 desde DB (2 unidades * 50000 = 100000)
    expect(row.subtotal).toBe(100000)
    // Total = subtotal * 0.88 (transfer discount)
    expect(row.total).toBe(88000)

    const items = row.items as Array<{ name: string; price: number; image: string }>
    expect(items[0].price).toBe(50000)
    expect(items[0].name).toBe('Set Rojo') // no "Producto Falso"
    expect(items[0].image).toBe('https://cdn/x.webp')
  })

  it('rejects an empty cart', async () => {
    const { createOrder } = await import('@/app/(store)/checkout/actions')
    const result = await createOrder([], validForm)
    expect(result).toEqual({ ok: false, error: 'Tu carrito está vacío' })
    expect(insertCalls).toHaveLength(0)
  })

  it('rejects out-of-stock products', async () => {
    const { createOrder } = await import('@/app/(store)/checkout/actions')
    const result = await createOrder(
      [{ productId: 'p2', quantity: 1, size: 'M', color: 'negro' }],
      validForm,
    )
    expect(result).toMatchObject({ ok: false })
    expect((result as { error: string }).error).toContain('Solo quedan 0')
    expect(insertCalls).toHaveLength(0)
  })

  it('rejects inactive products', async () => {
    const { createOrder } = await import('@/app/(store)/checkout/actions')
    const result = await createOrder(
      [{ productId: 'p3', quantity: 1, size: 'M', color: 'negro' }],
      validForm,
    )
    expect(result).toMatchObject({ ok: false })
    expect((result as { error: string }).error).toContain('ya no está disponible')
    expect(insertCalls).toHaveLength(0)
  })

  it('rejects unknown product ids', async () => {
    const { createOrder } = await import('@/app/(store)/checkout/actions')
    const result = await createOrder(
      [{ productId: 'does-not-exist', quantity: 1, size: 'M', color: 'rojo' }],
      validForm,
    )
    expect(result).toMatchObject({ ok: false })
    expect(insertCalls).toHaveLength(0)
  })

  it('rejects non-integer or negative quantities', async () => {
    const { createOrder } = await import('@/app/(store)/checkout/actions')

    const negative = await createOrder(
      [{ productId: 'p1', quantity: -1, size: 'M', color: 'rojo' }],
      validForm,
    )
    expect(negative).toMatchObject({ ok: false, error: 'Cantidad inválida' })

    const decimal = await createOrder(
      [{ productId: 'p1', quantity: 1.5, size: 'M', color: 'rojo' }],
      validForm,
    )
    expect(decimal).toMatchObject({ ok: false, error: 'Cantidad inválida' })

    const huge = await createOrder(
      [{ productId: 'p1', quantity: 9999, size: 'M', color: 'rojo' }],
      validForm,
    )
    expect(huge).toMatchObject({ ok: false, error: 'Cantidad inválida' })

    expect(insertCalls).toHaveLength(0)
  })

  it('rejects invalid email', async () => {
    const { createOrder } = await import('@/app/(store)/checkout/actions')
    const result = await createOrder(
      [{ productId: 'p1', quantity: 1, size: 'M', color: 'rojo' }],
      { ...validForm, customerEmail: 'no-arroba' },
    )
    expect(result).toEqual({ ok: false, error: 'Email inválido' })
    expect(insertCalls).toHaveLength(0)
  })
})
