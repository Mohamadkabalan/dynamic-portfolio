/**
 * Cache tag names shared by the data fetchers and the revalidation webhook.
 *
 * Every query is tagged with the document types it reads (e.g. `caseStudy`),
 * and single-document queries add a slug tag (e.g. `caseStudy:my-project`).
 * When Sanity tells us a document changed, we expire the matching tags.
 */

export const DOCUMENT_TYPES = [
  'siteSettings',
  'homePage',
  'aboutPage',
  'caseStudy',
  'contentPiece',
  'service',
  'testimonial',
  'client',
  'stat',
  'tool',
  'toolCategory',
  'certification',
] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]

const KNOWN_TYPES: ReadonlySet<string> = new Set(DOCUMENT_TYPES)

export function isDocumentType(value: unknown): value is DocumentType {
  return typeof value === 'string' && KNOWN_TYPES.has(value)
}

/** Tag for one document, addressed by its slug. */
export function slugTag(type: DocumentType, slug: string): string {
  return `${type}:${slug}`
}

export interface RevalidatePayload {
  _type?: unknown
  slug?: unknown
  previousSlug?: unknown
}

/**
 * Works out which cache tags a webhook payload should expire.
 * Returns an empty list for unknown document types.
 */
export function tagsForPayload(payload: RevalidatePayload | null | undefined): string[] {
  if (!payload || !isDocumentType(payload._type)) return []

  const tags = new Set<string>([payload._type])
  for (const slug of [payload.slug, payload.previousSlug]) {
    // Next.js ignores tags longer than 256 characters.
    if (typeof slug === 'string' && slug.length > 0 && slug.length <= 200) {
      tags.add(slugTag(payload._type, slug))
    }
  }
  return [...tags]
}
