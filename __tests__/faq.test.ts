import { describe, it, expect } from 'vitest'
import {
  FAQ_ITEMS,
  FAQ_CATEGORY_LABELS,
  getFeaturedFAQ,
  groupFAQByCategory,
  buildFAQPageSchema,
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

describe('buildFAQPageSchema', () => {
  it('returns a FAQPage object with mainEntity array', () => {
    const schema = buildFAQPageSchema(FAQ_ITEMS)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(FAQ_ITEMS.length)
  })

  it('each mainEntity item has name and acceptedAnswer.text', () => {
    const schema = buildFAQPageSchema(FAQ_ITEMS.slice(0, 3))
    schema.mainEntity.forEach((entity, i) => {
      expect(entity['@type']).toBe('Question')
      expect(entity.name).toBe(FAQ_ITEMS[i].question)
      expect(entity.acceptedAnswer['@type']).toBe('Answer')
      expect(typeof entity.acceptedAnswer.text).toBe('string')
      expect(entity.acceptedAnswer.text.length).toBeGreaterThan(0)
    })
  })

  it('strips markdown-style links from answer text in schema', () => {
    const items = [FAQ_ITEMS.find((i) => i.id === 5)!]
    const schema = buildFAQPageSchema(items)
    const text = schema.mainEntity[0].acceptedAnswer.text
    expect(text).not.toMatch(/\[.*\]\(.*\)/)
    expect(text).toContain('guía de talles')
  })
})
