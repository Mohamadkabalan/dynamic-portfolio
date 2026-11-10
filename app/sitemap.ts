import type {MetadataRoute} from 'next'

import {siteUrl} from '@/sanity/env'
import {getSitemapData} from '@/sanity/lib/data'

/**
 * /sitemap.xml — built from CMS data and cached. Publishing or deleting a
 * case study updates it automatically (no rebuild).
 *
 * The site is one page plus a page per case study; the sections (#work,
 * #about, #contact) are part of the home page and are not listed separately.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData()
  const caseStudies = data?.caseStudies ?? []

  // The home page changes whenever any of the content on it does.
  const homeModified = [data?.home, data?.about, data?.settings, ...caseStudies.map((study) => study._updatedAt)]
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1)

  return [
    {
      url: `${siteUrl}/`,
      lastModified: homeModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...caseStudies.map((study) => ({
      url: `${siteUrl}/work/${study.slug}`,
      lastModified: study._updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
