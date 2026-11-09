import Image from 'next/image'

import {croppedAspectRatio, hasAsset, imageUrl, type CmsImage} from '@/sanity/lib/image'

interface SanityImageProps {
  image: CmsImage | null | undefined
  /**
   * How wide the image is displayed at each breakpoint, e.g.
   * "(min-width: 1024px) 50vw, 100vw". The browser uses it to pick the
   * smallest file that still looks sharp.
   */
  sizes: string
  /** Overrides the alt text from the CMS. Pass "" for purely decorative images. */
  alt?: string
  /** Width ÷ height. When set, the image is cropped to this shape around the hotspot. */
  aspectRatio?: number
  /** The largest width (in CSS pixels × 2) this image is ever shown at. */
  maxWidth?: number
  /** Fill the parent element (which must be `position: relative` with a set size). */
  fill?: boolean
  /** Load immediately — only for the main image at the top of a page. */
  preload?: boolean
  className?: string
}

/**
 * Renders a Sanity image through `next/image`, respecting the crop and hotspot
 * set in the Studio, with a blurred placeholder while it loads. Dimensions are
 * always known up front, so images never shift the layout.
 */
export function SanityImage({
  image,
  sizes,
  alt,
  aspectRatio,
  maxWidth = 1600,
  fill = false,
  preload = false,
  className,
}: SanityImageProps) {
  if (!hasAsset(image)) return null

  const ratio = aspectRatio ?? croppedAspectRatio(image)
  const isSvg = image.extension === 'svg'
  const width = maxWidth
  const height = Math.round(width / ratio)
  const src = imageUrl(image, {width, aspectRatio})
  const blur = !isSvg && image.lqip ? image.lqip : undefined

  return (
    <Image
      src={src}
      alt={alt ?? image.alt ?? ''}
      sizes={sizes}
      {...(fill ? {fill: true} : {width, height})}
      {...(blur ? {placeholder: 'blur' as const, blurDataURL: blur} : {})}
      {...(preload ? {preload: true, fetchPriority: 'high' as const} : {})}
      unoptimized={isSvg}
      className={className}
    />
  )
}
