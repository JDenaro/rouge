'use client'

import { useRouter } from 'next/navigation'

interface SortSelectProps {
  currentSort: string
  currentCat: string
}

export function SortSelect({ currentSort, currentCat }: SortSelectProps) {
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    const params = new URLSearchParams()
    if (currentCat) params.set('cat', currentCat)
    if (value) params.set('orden', value)
    const qs = params.toString()
    router.push(`/productos${qs ? `?${qs}` : ''}`)
  }

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8125rem',
        color: 'var(--color-primary)',
        background: 'transparent',
        border: '1.5px solid var(--color-primary)',
        borderRadius: '999px',
        padding: '0.375rem 2rem 0.375rem 0.875rem',
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23C0445A\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.625rem center',
        cursor: 'pointer',
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      <option value="">Más recientes</option>
      <option value="price-asc">Precio: menor a mayor</option>
      <option value="price-desc">Precio: mayor a menor</option>
      <option value="name">Nombre</option>
    </select>
  )
}
