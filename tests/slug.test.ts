import {describe, expect, it} from 'vitest'

import {isValidSlug, SLUG_MAX_LENGTH, slugify} from '../sanity/lib/slug'

describe('isValidSlug', () => {
  it('accepts lowercase words joined by single hyphens', () => {
    expect(isValidSlug('pure-gym')).toBe(true)
    expect(isValidSlug('2024-launch')).toBe(true)
    expect(isValidSlug('a')).toBe(true)
  })

  it('rejects links, spaces, capitals and stray hyphens', () => {
    expect(isValidSlug('https://www.instagram.com/just_lite/')).toBe(false)
    expect(isValidSlug('Pure Gym')).toBe(false)
    expect(isValidSlug('pure--gym')).toBe(false)
    expect(isValidSlug('-pure-gym')).toBe(false)
    expect(isValidSlug('')).toBe(false)
    expect(isValidSlug(null)).toBe(false)
    expect(isValidSlug(undefined)).toBe(false)
    expect(isValidSlug('a'.repeat(SLUG_MAX_LENGTH + 1))).toBe(false)
  })
})

describe('slugify', () => {
  it('builds a valid slug from a title', () => {
    expect(slugify('Turning a Beauty Clinic into a safe destination.')).toBe(
      'turning-a-beauty-clinic-into-a-safe-destination',
    )
    expect(slugify('Café Noir & Co.')).toBe('cafe-noir-co')
    expect(slugify('  Pure   Gym  ')).toBe('pure-gym')
  })

  it('never produces something isValidSlug rejects', () => {
    for (const input of ['https://www.instagram.com/p/DZrVMNgNbhq/', 'Zürich 2026!', 'x'.repeat(200)]) {
      expect(isValidSlug(slugify(input))).toBe(true)
    }
    expect(slugify('***')).toBe('')
  })
})
