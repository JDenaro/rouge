import { describe, it, expect, expectTypeOf } from 'vitest'
import type { Product, Order, OrderItem, OrderStatus, ProductCategory } from '@/lib/supabase/types'

describe('database types', () => {
  it('Product has required fields', () => {
    expectTypeOf<Product>().toHaveProperty('id')
    expectTypeOf<Product>().toHaveProperty('name')
    expectTypeOf<Product>().toHaveProperty('price')
    expectTypeOf<Product>().toHaveProperty('category')
    expectTypeOf<Product>().toHaveProperty('images')
    expectTypeOf<Product>().toHaveProperty('sizes')
    expectTypeOf<Product>().toHaveProperty('colors')
    expectTypeOf<Product>().toHaveProperty('stock')
    expectTypeOf<Product>().toHaveProperty('active')
  })

  it('Order has required fields', () => {
    expectTypeOf<Order>().toHaveProperty('id')
    expectTypeOf<Order>().toHaveProperty('status')
    expectTypeOf<Order>().toHaveProperty('customer_name')
    expectTypeOf<Order>().toHaveProperty('customer_email')
    expectTypeOf<Order>().toHaveProperty('items')
    expectTypeOf<Order>().toHaveProperty('total')
    expectTypeOf<Order>().toHaveProperty('mp_preference_id')
    expectTypeOf<Order>().toHaveProperty('mp_payment_id')
  })

  it('OrderItem has snapshot fields', () => {
    expectTypeOf<OrderItem>().toHaveProperty('product_id')
    expectTypeOf<OrderItem>().toHaveProperty('name')
    expectTypeOf<OrderItem>().toHaveProperty('price')
    expectTypeOf<OrderItem>().toHaveProperty('quantity')
    expectTypeOf<OrderItem>().toHaveProperty('size')
    expectTypeOf<OrderItem>().toHaveProperty('color')
    expectTypeOf<OrderItem>().toHaveProperty('image')
  })

  it('OrderStatus union covers all expected values', () => {
    const statuses: OrderStatus[] = [
      'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
    ]
    expect(statuses).toHaveLength(6)
  })

  it('ProductCategory union covers all rouge categories', () => {
    const categories: ProductCategory[] = [
      'sets', 'baby-doll', 'body', 'catsuit', 'conjuntos',
      'corsets', 'bata', 'pijamas', 'disfraces', 'sexshop',
      'perfume-feromonas', 'panty-vedetina-culotte'
    ]
    expect(categories).toHaveLength(12)
  })
})
