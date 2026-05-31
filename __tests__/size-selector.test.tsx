import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CATEGORY_SIZES } from '@/lib/products'
import { AddToCart } from '@/components/store/AddToCart'

const mockAddItem = vi.fn()
vi.mock('@/components/store/CartContext', () => ({
  useCart: () => ({ addItem: mockAddItem }),
}))

beforeEach(() => { mockAddItem.mockClear() })

// ─── CATEGORY_SIZES config ───────────────────────────────────────────────────

describe('CATEGORY_SIZES', () => {
  it('sexshop has no selectors', () => {
    expect(CATEGORY_SIZES.sexshop).toEqual({ corpino: false, pantalon: false, aMedida: false })
  })

  it('perfume-feromonas has no selectors', () => {
    expect(CATEGORY_SIZES['perfume-feromonas']).toEqual({ corpino: false, pantalon: false, aMedida: false })
  })

  it('panty-vedetina-culotte has only pantalón + A medida', () => {
    expect(CATEGORY_SIZES['panty-vedetina-culotte']).toEqual({ corpino: false, pantalon: true, aMedida: true })
  })

  it('sets has all selectors', () => {
    expect(CATEGORY_SIZES.sets).toEqual({ corpino: true, pantalon: true, aMedida: true })
  })

  it('covers every ProductCategory', () => {
    const categories = [
      'sets', 'baby-doll', 'body', 'catsuit', 'conjuntos', 'corsets',
      'bata', 'pijamas', 'disfraces', 'sexshop', 'perfume-feromonas',
      'panty-vedetina-culotte',
    ] as const
    categories.forEach((cat) => {
      expect(CATEGORY_SIZES[cat]).toBeDefined()
    })
  })
})

// ─── AddToCart component ─────────────────────────────────────────────────────

const baseProps = {
  productId: 'p1',
  slug: 'test-product',
  name: 'Test Product',
  price: 10000,
  image: '',
  colors: [],
}

describe('AddToCart — standard category (sets)', () => {
  it('renders corpiño and pantalón selectors', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    expect(screen.getByText('Talle corpiño')).toBeTruthy()
    expect(screen.getByText('Talle pantalón')).toBeTruthy()
  })

  it('renders "A medida" pill', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    expect(screen.getByText('A medida')).toBeTruthy()
  })

  it('renders the legend about A medida', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    expect(screen.getByText(/Si necesitás un talle distinto/)).toBeTruthy()
  })

  it('clicking "A medida" hides selectors and shows measurement fields', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    fireEvent.click(screen.getByText('A medida'))
    expect(screen.queryByText('Talle corpiño')).toBeNull()
    expect(screen.queryByText('Talle pantalón')).toBeNull()
    expect(screen.getByText('Bajo busto')).toBeTruthy()
    expect(screen.getByText('Busto')).toBeTruthy()
    expect(screen.getByText('Cadera')).toBeTruthy()
    expect(screen.getByText('Cintura')).toBeTruthy()
    expect(screen.getByText('Largo de bajo busto a pelvis')).toBeTruthy()
  })

  it('blocks adding to cart when A medida fields are empty', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    fireEvent.click(screen.getByText('A medida'))
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).not.toHaveBeenCalled()
    expect(screen.getByText('Completá todas las medidas')).toBeTruthy()
  })

  it('adds to cart with serialized A medida string when all fields are filled', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    fireEvent.click(screen.getByText('A medida'))
    const inputs = document.querySelectorAll('input[type="text"]')
    const values = ['80', '90', '95', '68', '25']
    inputs.forEach((input, i) => fireEvent.change(input, { target: { value: values[i] } }))
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'A medida — BB: 80cm / B: 90cm / C: 95cm / Ci: 68cm / L: 25cm',
      }),
      1,
    )
  })

  it('adds to cart with corpiño/pantalón serialization in standard mode', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    fireEvent.click(screen.getByText('95'))   // select corpiño 95
    fireEvent.click(screen.getByText('42'))   // select pantalón 42
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ size: 'Corpiño: 95 / Pantalón: 42' }),
      1,
    )
  })
})

describe('AddToCart — panty-vedetina-culotte', () => {
  it('does not render corpiño selector', () => {
    render(<AddToCart {...baseProps} category="panty-vedetina-culotte" />)
    expect(screen.queryByText('Talle corpiño')).toBeNull()
  })

  it('renders pantalón selector', () => {
    render(<AddToCart {...baseProps} category="panty-vedetina-culotte" />)
    expect(screen.getByText('Talle pantalón')).toBeTruthy()
  })

  it('serializes as Pantalón only', () => {
    render(<AddToCart {...baseProps} category="panty-vedetina-culotte" />)
    fireEvent.click(screen.getByText('40'))
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ size: 'Pantalón: 40' }),
      1,
    )
  })
})

describe('AddToCart — sexshop', () => {
  it('renders no size selectors', () => {
    render(<AddToCart {...baseProps} category="sexshop" />)
    expect(screen.queryByText('Talle corpiño')).toBeNull()
    expect(screen.queryByText('Talle pantalón')).toBeNull()
    expect(screen.queryByText('A medida')).toBeNull()
  })

  it('adds to cart with empty size string', () => {
    render(<AddToCart {...baseProps} category="sexshop" />)
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ size: '' }),
      1,
    )
  })
})
