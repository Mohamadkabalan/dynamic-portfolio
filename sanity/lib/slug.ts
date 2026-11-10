/**
 * Case study web addresses ("slugs") become part of a URL, so they may only
 * contain lowercase letters, numbers and single hyphens: /work/pure-gym.
 * Anything else (a pasted link, spaces, accents) would break the page link
 * and the build, so it is rejected in the Studio and ignored by the site.
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const SLUG_MAX_LENGTH = 80

export function isValidSlug(slug: string | null | undefined): slug is string {
  return typeof slug === 'string' && slug.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(slug)
}

/** Turns free text (usually the title) into a valid slug: "Café Noir & Co." → "cafe-noir-co". */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, '')
}
