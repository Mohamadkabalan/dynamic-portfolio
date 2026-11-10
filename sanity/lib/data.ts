import 'server-only'

import {cache} from 'react'

import {isSanityConfigured} from '../env'
import {sanityFetch} from './live'
import {
  ABOUT_QUERY,
  CASE_STUDY_META_QUERY,
  CASE_STUDY_QUERY,
  CASE_STUDY_SLUGS_QUERY,
  CONTACT_QUERY,
  HOME_QUERY,
  SITEMAP_QUERY,
  SITE_SETTINGS_QUERY,
  WORK_INDEX_QUERY,
} from './queries'
import {isValidSlug} from './slug'
import {slugTag, type DocumentType} from './tags'

/**
 * Data fetchers for every page. All of them:
 *  - go through `sanityFetch`, so results are cached and tagged;
 *  - read published content only (`perspective: 'published'`);
 *  - add document-type tags so the webhook at /api/revalidate can purge them;
 *  - return `null` until the Sanity project is configured, so the site can
 *    show a setup notice instead of crashing.
 *
 * `cache()` de-duplicates calls within one render (layout + page + metadata).
 */

const published = {perspective: 'published', stega: false} as const

function tags(...types: DocumentType[]): string[] {
  return types
}

export const getSiteSettings = cache(async () => {
  if (!isSanityConfigured) return null
  const {data} = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    ...published,
    tags: tags('siteSettings'),
  })
  return data
})

export const getHomeData = cache(async () => {
  if (!isSanityConfigured) return null
  const {data} = await sanityFetch({
    query: HOME_QUERY,
    ...published,
    tags: tags(
      'homePage',
      'client',
      'stat',
      'caseStudy',
      'contentPiece',
      'service',
      'testimonial',
      'tool',
    ),
  })
  return data
})

/**
 * Every case study with a usable page address. One whose address is not a
 * valid slug (e.g. a pasted link) cannot have a page, so it is left out here,
 * in the sitemap and at build time; the Studio flags it for the editor.
 */
export const getWorkIndex = cache(async () => {
  if (!isSanityConfigured) return []
  const {data} = await sanityFetch({
    query: WORK_INDEX_QUERY,
    ...published,
    tags: tags('caseStudy', 'client'),
  })
  return data.filter((study) => isValidSlug(study.slug))
})

export const getCaseStudySlugs = cache(async () => {
  if (!isSanityConfigured) return []
  const {data} = await sanityFetch({
    query: CASE_STUDY_SLUGS_QUERY,
    ...published,
    tags: tags('caseStudy'),
  })
  return data.filter((study) => isValidSlug(study.slug))
})

export const getCaseStudy = cache(async (slug: string) => {
  if (!isSanityConfigured) return null
  const {data} = await sanityFetch({
    query: CASE_STUDY_QUERY,
    params: {slug},
    ...published,
    tags: [
      ...tags('caseStudy', 'client', 'testimonial', 'contentPiece'),
      slugTag('caseStudy', slug),
    ],
  })
  return data
})

export const getCaseStudyMeta = cache(async (slug: string) => {
  if (!isSanityConfigured) return null
  const {data} = await sanityFetch({
    query: CASE_STUDY_META_QUERY,
    params: {slug},
    ...published,
    tags: [...tags('caseStudy', 'client'), slugTag('caseStudy', slug)],
  })
  return data
})

export const getAboutData = cache(async () => {
  if (!isSanityConfigured) return null
  const {data} = await sanityFetch({
    query: ABOUT_QUERY,
    ...published,
    tags: tags('aboutPage', 'certification'),
  })
  return data
})

export const getContactData = cache(async () => {
  if (!isSanityConfigured) return null
  const {data} = await sanityFetch({
    query: CONTACT_QUERY,
    ...published,
    tags: tags('service'),
  })
  return data
})

export const getSitemapData = cache(async () => {
  if (!isSanityConfigured) return null
  const {data} = await sanityFetch({
    query: SITEMAP_QUERY,
    ...published,
    tags: tags('homePage', 'aboutPage', 'siteSettings', 'caseStudy'),
  })
  return data && {...data, caseStudies: data.caseStudies.filter((study) => isValidSlug(study.slug))}
})

export type SiteSettings = NonNullable<Awaited<ReturnType<typeof getSiteSettings>>>
export type HomeData = NonNullable<Awaited<ReturnType<typeof getHomeData>>>
export type CaseStudyCard = Awaited<ReturnType<typeof getWorkIndex>>[number]
export type CaseStudy = NonNullable<Awaited<ReturnType<typeof getCaseStudy>>>
export type AboutData = NonNullable<Awaited<ReturnType<typeof getAboutData>>>
export type FeedItem = HomeData['feed'][number]
export type Testimonial = HomeData['testimonials'][number]
export type Service = HomeData['services'][number]
export type Stat = HomeData['stats'][number]
export type Tool = HomeData['tools'][number]
export type LogoClient = HomeData['clients'][number]
