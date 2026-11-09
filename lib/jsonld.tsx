import {siteDescription, siteName, siteTitle} from '@/lib/site'
import {siteUrl} from '@/sanity/env'
import type {SiteSettings} from '@/sanity/lib/data'

type JsonLdData = Record<string, unknown>

/** Structured data that helps search engines understand the page. */
export function JsonLd({data}: {data: JsonLdData}) {
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so content from the CMS can never close the script tag.
      dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, '\\u003c')}}
    />
  )
}

export function personJsonLd(settings: SiteSettings | null): JsonLdData {
  const sameAs = (settings?.socialLinks ?? []).map((link) => link.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteName(settings),
    jobTitle: siteTitle(settings),
    description: siteDescription(settings),
    url: siteUrl,
    ...(settings?.contactEmail ? {email: `mailto:${settings.contactEmail}`} : {}),
    ...(settings?.location ? {address: settings.location} : {}),
    ...(sameAs.length > 0 ? {sameAs} : {}),
  }
}

interface ArticleInput {
  title: string
  description?: string | null
  path: string
  image?: string | null
  dateModified?: string | null
}

export function caseStudyJsonLd(settings: SiteSettings | null, article: ArticleInput): JsonLdData {
  const author = {'@type': 'Person', name: siteName(settings), url: siteUrl}
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    ...(article.description ? {description: article.description} : {}),
    ...(article.image ? {image: [article.image]} : {}),
    ...(article.dateModified ? {dateModified: article.dateModified} : {}),
    mainEntityOfPage: `${siteUrl}${article.path}`,
    author,
    publisher: author,
  }
}
