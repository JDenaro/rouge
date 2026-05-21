export type ProductCategory =
  | 'sets'
  | 'baby-doll'
  | 'body'
  | 'catsuit'
  | 'conjuntos'
  | 'corsets'
  | 'bata'
  | 'pijamas'
  | 'disfraces'
  | 'sexshop'
  | 'perfume-feromonas'
  | 'panty-vedetina-culotte'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderItem = {
  product_id: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: ProductCategory
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  active: boolean
  created_at: string
}

export type Order = {
  id: string
  status: OrderStatus
  customer_name: string
  customer_email: string
  customer_phone: string | null
  items: OrderItem[]
  subtotal: number
  total: number
  mp_preference_id: string | null
  mp_payment_id: string | null
  mp_status: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
    }
  }
}
