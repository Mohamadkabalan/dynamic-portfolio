'use client'

/**
 * `next/image` loader for the Sanity image CDN (configured in next.config.ts).
 *
 * `next/image` asks for each image at several widths. For Sanity images this
 * rewrites the URL so Sanity's CDN resizes it — keeping the crop/hotspot that
 * is already encoded in the URL — and serves AVIF/WebP where supported.
 */
interface LoaderArgs {
  src: string
  width: number
  quality?: number
}

/** Only set by `npm run dev:mock` (a local stand-in for Sanity's image CDN). */
const MOCK_IMAGE_HOST = process.env.NEXT_PUBLIC_SANITY_IMAGE_HOST

export default function sanityImageLoader({src, width, quality}: LoaderArgs): string {
  const isSanityImage =
    src.startsWith('https://cdn.sanity.io/') ||
    Boolean(MOCK_IMAGE_HOST && src.startsWith(MOCK_IMAGE_HOST))
  if (!isSanityImage) return src

  const url = new URL(src)
  const baseWidth = Number(url.searchParams.get('w'))
  const baseHeight = Number(url.searchParams.get('h'))

  url.searchParams.set('auto', 'format')
  if (!url.searchParams.has('fit')) {
    url.searchParams.set('fit', baseHeight ? 'min' : 'max')
  }
  if (baseWidth && baseHeight) {
    // Keep the requested shape when scaling to a different width.
    url.searchParams.set('h', String(Math.round((baseHeight / baseWidth) * width)))
  }
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 75))
  return url.href
}
