import { createServerClient } from '@/lib/supabase/server'
import type { Order, Product } from '@/lib/supabase/types'

export type DashboardStats = {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  pendingOrders: number
  recentOrders: Order[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServerClient()
  const [productsRes, ordersRes, recentRes] = await Promise.all([
    supabase.from('products').select('active'),
    supabase.from('orders').select('status'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const products =
    (productsRes.data as unknown as Array<{ active: boolean }> | null) ?? []
  const orders =
    (ordersRes.data as unknown as Array<{ status: string }> | null) ?? []
  const recentOrders =
    (recentRes.data as unknown as Order[] | null) ?? []

  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.active).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    recentOrders,
  }
}

export async function listProducts(): Promise<Product[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) {
    if (error) console.error('listProducts:', error)
    return []
  }
  return data as unknown as Product[]
}

export async function listOrders(): Promise<Order[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) {
    if (error) console.error('listOrders:', error)
    return []
  }
  return data as unknown as Order[]
}
