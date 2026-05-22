'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

export type CartItem = {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  count: number
  subtotal: number
  total: number
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQty: (productId: string, size: string, color: string, qty: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

const CartCtx = createContext<CartState | null>(null)

const STORAGE_KEY = 'rouge-cart-v1'
const TRANSFER_DISCOUNT = 0.88

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function sameLine(a: CartItem, productId: string, size: string, color: string): boolean {
  return a.productId === productId && a.size === size && a.color === color
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => sameLine(p, item.productId, item.size, item.color))
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
        return copy
      }
      return [...prev, { ...item, quantity: qty }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, productId, size, color)))
  }, [])

  const updateQty = useCallback((productId: string, size: string, color: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((p) => !sameLine(p, productId, size, color))
      return prev.map((p) => (sameLine(p, productId, size, color) ? { ...p, quantity: qty } : p))
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartState>(() => {
    const count = items.reduce((acc, i) => acc + i.quantity, 0)
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
    const total = Math.round(subtotal * TRANSFER_DISCOUNT)
    return { items, count, subtotal, total, isOpen, addItem, removeItem, updateQty, clear, openCart, closeCart }
  }, [items, isOpen, addItem, removeItem, updateQty, clear, openCart, closeCart])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart(): CartState {
  const ctx = useContext(CartCtx)
  if (!ctx) {
    // Fallback for SSR / first paint before provider mounts
    return {
      items: [],
      count: 0,
      subtotal: 0,
      total: 0,
      isOpen: false,
      addItem: () => {},
      removeItem: () => {},
      updateQty: () => {},
      clear: () => {},
      openCart: () => {},
      closeCart: () => {},
    }
  }
  return ctx
}
