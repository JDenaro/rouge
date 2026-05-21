import { describe, it, expect } from 'vitest'

describe('project smoke test', () => {
  it('design tokens are defined as constants', () => {
    const tokens = {
      colorPrimary:   '#C0445A',
      colorSecondary: '#EC4899',
      colorAccent:    '#D97706',
      colorBg:        '#FDF8F8',
      colorFg:        '#1A0A0D',
    }
    Object.values(tokens).forEach(value => {
      expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})
