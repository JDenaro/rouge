import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FAQ } from '@/components/store/FAQ'
import { FAQ_ITEMS, getFeaturedFAQ } from '@/lib/faq'

describe('FAQ component', () => {
  it('renders all provided items as <details>', () => {
    const items = FAQ_ITEMS.slice(0, 3)
    const { container } = render(<FAQ items={items} />)
    const details = container.querySelectorAll('details')
    expect(details).toHaveLength(3)
  })

  it('shows the question in each <summary>', () => {
    const items = getFeaturedFAQ()
    render(<FAQ items={items} />)
    items.forEach((item) => {
      expect(screen.getByText(item.question)).toBeTruthy()
    })
  })

  it('renders category headings when groupByCategory is true', () => {
    render(<FAQ items={FAQ_ITEMS} groupByCategory />)
    expect(screen.getByText('Hechas a medida')).toBeTruthy()
    expect(screen.getByText('Talles y medidas')).toBeTruthy()
    expect(screen.getByText('Envíos')).toBeTruthy()
    expect(screen.getByText('Pagos')).toBeTruthy()
  })

  it('does not render category headings when groupByCategory is false', () => {
    render(<FAQ items={FAQ_ITEMS} />)
    expect(screen.queryByText('Hechas a medida')).toBeNull()
  })

  it('renders the CTA link when showCta is true', () => {
    render(<FAQ items={getFeaturedFAQ()} showCta />)
    const cta = screen.getByRole('link', { name: /ver todas las preguntas/i })
    expect(cta.getAttribute('href')).toBe('/faq')
  })

  it('parses markdown links in answers into anchor elements', () => {
    const items = [FAQ_ITEMS.find((i) => i.id === 5)!] // contains /guia-de-talles link
    const { container } = render(<FAQ items={items} />)
    const link = container.querySelector('a[href="/guia-de-talles"]')
    expect(link).toBeTruthy()
    expect(link?.textContent).toBe('guía de talles')
  })

  it('toggles details open attribute when summary is clicked', () => {
    const items = FAQ_ITEMS.slice(0, 1)
    const { container } = render(<FAQ items={items} />)
    const details = container.querySelector('details') as HTMLDetailsElement
    const summary = details.querySelector('summary') as HTMLElement
    expect(details.open).toBe(false)
    fireEvent.click(summary)
    expect(details.open).toBe(true)
  })
})
