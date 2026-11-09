import type {Metadata} from 'next'

import {siteDescription, siteName, siteTitle} from '@/lib/site'
import type {SiteSettings} from '@/sanity/lib/data'
import {hasAsset, staticImageUrl, type CmsImage} from '@/sanity/lib/image'

/** The default generated sharing image (see app/(site)/og/route.tsx). */
export const GENERATED_OG_IMAGE = '/og'

interface SeoFields {
  title?: string | null
  description?: string | null
  image?: CmsImage | null
}

interface PageMetadataOptions {
  settings: SiteSettings | null
  /** The page's own "Search & social sharing" fields from the CMS. */
  seo?: SeoFields | null
  /** Used when the SEO title is empty, e.g. the case study title. */
  title?: string | null
  /** Used when the SEO description is empty, e.g. the case study summary. */
  description?: string | null
  /** Used when no sharing image is set, e.g. the case study cover. */
  image?: CmsImage | null
  /** The page's path, e.g. "/work/my-project". */
  path: string
  /** The generated sharing image to use when none is uploaded. Defaults to the site card. */
  generatedImage?: string
  /** Use the title exactly as given instead of applying the site's title pattern. */
  absoluteTitle?: boolean
  type?: 'website' | 'article'
}

/**
 * Builds the metadata for a page from CMS content, falling back from the page's
 * SEO fields → the page's own content → the site-wide defaults.
 *
 * When no image has been uploaded, a sharing image is generated from CMS data
 * by the routes under `app/(site)/og` (built with `next/og`).
 */
export function pageMetadata({
  settings,
  seo,
  title,
  description,
  image,
  path,
  generatedImage = GENERATED_OG_IMAGE,
  absoluteTitle = false,
  type = 'website',
}: PageMetadataOptions): Metadata {
  const name = siteName(settings)
  const resolvedTitle = seo?.title?.trim() || title?.trim() || null
  const resolvedDescription =
    seo?.description?.trim() || description?.trim() || siteDescription(settings)
  const homeTitle = `${name} — ${siteTitle(settings)}`

  const shareImage = [seo?.image, image].find((candidate) => hasAsset(candidate))
  const images = [
    shareImage
      ? {
          url: staticImageUrl(shareImage, {width: 1200, height: 630, format: 'jpg'}),
          width: 1200,
          height: 630,
          alt: shareImage.alt || resolvedTitle || homeTitle,
        }
      : {url: generatedImage, width: 1200, height: 630, alt: resolvedTitle || homeTitle},
  ]

  const socialTitle = resolvedTitle ?? homeTitle

  return {
    title: resolvedTitle
      ? absoluteTitle
        ? {absolute: resolvedTitle}
        : resolvedTitle
      : absoluteTitle
        ? {absolute: homeTitle}
        : undefined,
    description: resolvedDescription,
    alternates: {canonical: path},
    openGraph: {
      type,
      siteName: name,
      title: socialTitle,
      description: resolvedDescription,
      url: path,
      locale: 'en',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: resolvedDescription,
      images: images.map((item) => item.url),
    },
  }
}
