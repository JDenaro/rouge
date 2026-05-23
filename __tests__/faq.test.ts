import { describe, it, expect } from 'vitest'
import {
  FAQ_ITEMS,
  FAQ_CATEGORY_LABELS,
  getFeaturedFAQ,
  groupFAQByCategory,
} from '@/lib/faq'

describe('FAQ data', () => {
  it('has 13 items total', () => {
    expect(FAQ_ITEMS).toHaveLength(13)
  })

  it('every item has a unique numeric id', () => {
    const ids = FAQ_ITEMS.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id) => expect(typeof id).toBe('number'))
  })

  it('has 4 category labels', () => {
    expect(Object.keys(FAQ_CATEGORY_LABELS)).toHaveLength(4)
  })

  it('getFeaturedFAQ returns exactly 6 items, all featured', () => {
    const featured = getFeaturedFAQ()
    expect(featured).toHaveLength(6)
    expect(featured.every((i) => i.featured)).toBe(true)
  })

  it('groupFAQByCategory groups by 4 categories with counts 4/3/3/3', () => {
    const grouped = groupFAQByCategory()
    expect(grouped['made-to-order']).toHaveLength(4)
    expect(grouped['sizing']).toHaveLength(3)
    expect(grouped['shipping']).toHaveLength(3)
    expect(grouped['payments']).toHaveLength(3)
  })

  it('every answer is a non-empty string', () => {
    FAQ_ITEMS.forEach((i) => {
      expect(i.answer.length).toBeGreaterThan(10)
    })
  })
})
