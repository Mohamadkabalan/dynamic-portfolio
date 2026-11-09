/** Joins class names, skipping empty values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href)
}

const compactFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 12400 → "12.4K", 4200000 → "4.2M". */
export function formatCompact(value: number): string {
  return compactFormatter.format(value)
}

/** How many decimals a CMS number was entered with (so count-ups keep them). */
export function decimalPlaces(value: number): number {
  const [, decimals = ''] = String(value).split('.')
  return Math.min(decimals.length, 2)
}

/** Splits a headline around the highlighted phrase (case-insensitive). */
export function splitHighlight(
  headline: string,
  highlight: string | null | undefined,
): {before: string; match: string; after: string} | null {
  if (!highlight?.trim()) return null
  const index = headline.toLowerCase().indexOf(highlight.trim().toLowerCase())
  if (index === -1) return null
  const end = index + highlight.trim().length
  return {
    before: headline.slice(0, index),
    match: headline.slice(index, end),
    after: headline.slice(end),
  }
}

/** Turns "@handle" or a profile URL into a tidy display handle. */
export function displayHandle(handle: string | null | undefined, url: string): string {
  if (handle?.trim()) return handle.trim()
  try {
    const {hostname, pathname} = new URL(url)
    const path = pathname.replace(/\/$/, '')
    return path && path !== '/' ? `@${path.split('/').pop()}` : hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
