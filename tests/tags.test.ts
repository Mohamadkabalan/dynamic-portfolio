import {describe, expect, it} from 'vitest'

import {tagsForPayload} from '@/sanity/lib/tags'

describe('tagsForPayload', () => {
  it('returns the type tag for documents without a slug', () => {
    expect(tagsForPayload({_type: 'siteSettings'})).toEqual(['siteSettings'])
  })

  it('adds slug tags for the current and previous slug', () => {
    expect(tagsForPayload({_type: 'caseStudy', slug: 'b', previousSlug: 'a'})).toEqual([
      'caseStudy',
      'caseStudy:b',
      'caseStudy:a',
    ])
  })

  it('does not duplicate the slug tag when the slug did not change', () => {
    expect(tagsForPayload({_type: 'caseStudy', slug: 'a', previousSlug: 'a'})).toEqual([
      'caseStudy',
      'caseStudy:a',
    ])
  })

  it('ignores unknown types, empty payloads and non-string slugs', () => {
    expect(tagsForPayload(null)).toEqual([])
    expect(tagsForPayload({})).toEqual([])
    expect(tagsForPayload({_type: 'sanity.imageAsset'})).toEqual([])
    expect(tagsForPayload({_type: 'caseStudy', slug: 42})).toEqual(['caseStudy'])
  })
})
