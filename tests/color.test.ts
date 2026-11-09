import {describe, expect, it} from 'vitest'

import {
  PAPER_DARK,
  PAPER_LIGHT,
  accentTokens,
  contrastRatio,
  ensureContrast,
  parseHex,
  readableOn,
} from '@/lib/color'

const SAMPLE_ACCENTS = [
  '#F0502D', // default vermilion
  '#FF6B5E',
  '#F5A524',
  '#0E9F6E',
  '#2F5BFF',
  '#6D4AFF',
  '#D6409F',
  '#1B1A19',
  '#FFFFFF',
  '#000000',
  '#808080', // worst case: mid grey
  '#FFE600',
  '#00E5FF',
]

describe('colour helpers', () => {
  it('parses 6-digit hex colours and rejects everything else', () => {
    expect(parseHex('#F0502D')).toEqual([240, 80, 45])
    expect(parseHex('f0502d')).toEqual([240, 80, 45])
    expect(parseHex('#fff')).toBeNull()
    expect(parseHex('red')).toBeNull()
    expect(parseHex(null)).toBeNull()
  })

  it('computes WCAG contrast ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1)
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5)
  })

  it.each(SAMPLE_ACCENTS)('picks AA-readable text on accent %s', (accent) => {
    expect(contrastRatio(readableOn(accent), accent)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(SAMPLE_ACCENTS)('derives AA accent text for both themes from %s', (accent) => {
    const tokens = accentTokens(accent)
    expect(contrastRatio(tokens.onAccent, tokens.accent)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(tokens.accentInkLight, PAPER_LIGHT)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(tokens.accentInkDark, PAPER_DARK)).toBeGreaterThanOrEqual(4.5)
  })

  it('leaves colours that already pass untouched', () => {
    expect(ensureContrast('#151311', PAPER_LIGHT)).toBe('#151311')
  })

  it('falls back to the default accent for invalid input', () => {
    expect(accentTokens('not-a-colour').accent).toBe('#F0502D')
    expect(accentTokens(null).accent).toBe('#F0502D')
  })
})
