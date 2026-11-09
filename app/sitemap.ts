import type {MetadataRoute} from 'next'

import {siteUrl} from '@/sanity/env'
import {getSitemapData} from '@/sanity/lib/data'

/**
 * /sitemap.xml — built from CMS data and cached. Publishing or deleting a
 * case study updates it automatically (no rebuild).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData()
  const caseStudies = data?.caseStudies ?? []

  const latestCaseStudy = caseStudies
    .map((study) => study._updatedAt)
    .sort()
    .at(-1)

  const pages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: data?.home ?? undefined,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: latestCaseStudy ?? undefined,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: data?.about ?? undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: data?.settings ?? undefined,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]

  return [
    ...pages,
    ...caseStudies.map((study) => ({
      url: `${siteUrl}/work/${study.slug}`,
      lastModified: study._updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
