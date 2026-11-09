import {createImageUrlBuilder} from '@sanity/image-url'

import {dataset, imageHost, safeProjectId} from '../env'
import type {SanityImageAssetReference, SanityImageCrop, SanityImageHotspot} from '../types'

/** The shape every image has after it is fetched with the `imageFields` GROQ fragment. */
export interface CmsImage {
  asset: SanityImageAssetReference | null
  crop: SanityImageCrop | null
  hotspot: SanityImageHotspot | null
  alt: string | null
  /** Tiny blurred preview, shown while the real image loads. */
  lqip: string | null
  width: number | null
  height: number | null
  extension?: string | null
}

const builder = createImageUrlBuilder({
  projectId: safeProjectId,
  dataset,
  ...(imageHost ? {baseUrl: imageHost} : {}),
})

export function hasAsset<T extends {asset: SanityImageAssetReference | null}>(
  image: T | null | undefined,
): image is T & {asset: SanityImageAssetReference} {
  return Boolean(image?.asset?._ref)
}

/** Width ÷ height of the image as the editor cropped it in the Studio. */
export function croppedAspectRatio(image: CmsImage): number {
  const width = image.width ?? 4
  const height = image.height ?? 3
  const crop = image.crop
  const visibleWidth = width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))
  const visibleHeight = height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))
  return visibleWidth > 0 && visibleHeight > 0 ? visibleWidth / visibleHeight : width / height
}

interface ImageUrlOptions {
  width: number
  /** Width ÷ height. When set, the image is cropped to this shape around the hotspot. */
  aspectRatio?: number
  quality?: number
}

/**
 * Builds a Sanity image CDN URL that respects the crop and hotspot chosen in
 * the Studio. The responsive `w`/`h` values are rewritten per device by
 * `imageLoader.ts`.
 */
export function imageUrl(image: CmsImage, {width, aspectRatio, quality}: ImageUrlOptions): string {
  let url = builder
    .image({asset: image.asset, crop: image.crop, hotspot: image.hotspot})
    .width(Math.round(width))
  if (aspectRatio) {
    url = url.height(Math.round(width / aspectRatio)).fit('crop')
  }
  if (quality) url = url.quality(quality)
  return url.url()
}

/** A plain URL for images used outside `next/image` (favicons, social cards, JSON-LD). */
export function staticImageUrl(
  image: CmsImage,
  options: {width: number; height?: number; format?: 'png' | 'jpg' | 'webp'},
): string {
  let url = builder
    .image({asset: image.asset, crop: image.crop, hotspot: image.hotspot})
    .width(options.width)
  if (options.height) url = url.height(options.height).fit('crop')
  if (options.format) url = url.format(options.format)
  return url.url()
}
