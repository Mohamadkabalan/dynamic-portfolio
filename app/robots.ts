import type {MetadataRoute} from 'next'

import {siteUrl} from '@/sanity/env'
import {getSitemapData} from '@/sanity/lib/data'

/**
 * /robots.txt — driven by CMS data. Until the home page has been published the
 * whole site is hidden from search engines, so an empty or half-built site is
 * never indexed. The Studio and API are always excluded.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const data = await getSitemapData()
  const hasPublishedContent = Boolean(data?.home)

  if (!hasPublishedContent) {
    return {rules: [{userAgent: '*', disallow: '/'}]}
  }

  return {
    rules: [{userAgent: '*', allow: '/', disallow: ['/studio', '/api/', '/__forms.html']}],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
