import {defineQuery} from 'next-sanity'

/**
 * Every GROQ query used by the website lives in this file.
 * After changing a query or a schema, run `npm run typegen` to refresh the
 * generated TypeScript types in `sanity/types.ts`.
 */

/* ------------------------------ fragments ------------------------------ */

/** Fields needed to render an image with crop/hotspot and a blur placeholder. */
const imageFields = /* groq */ `
  asset,
  crop,
  hotspot,
  alt,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "extension": asset->extension
`

const seoFields = /* groq */ `
  title,
  description,
  image{${imageFields}}
`

const caseStudyCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  industry,
  platforms,
  timeframe,
  summary,
  featured,
  cover{${imageFields}},
  "clientName": client->name,
  "topResults": results[0...2]{_key, label, value, prefix, suffix}
`

const feedItemFields = /* groq */ `
  _id,
  title,
  type,
  platform,
  caption,
  originalUrl,
  embedUrl,
  "videoUrl": video.asset->url,
  images[]{_key, ${imageFields}},
  poster{${imageFields}},
  metrics{views, likes, comments, shares, saves},
  "caseStudy": caseStudy->{title, "slug": slug.current}
`

const testimonialFields = /* groq */ `
  _id,
  quote,
  name,
  role,
  company,
  avatar{${imageFields}}
`

/* ------------------------------- settings ------------------------------- */

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    name,
    title,
    logo{${imageFields}},
    favicon{${imageFields}},
    accentColor,
    socialLinks[]{_key, platform, url, handle, followerCount},
    availability{isAvailable, text},
    contactEmail,
    location,
    "resumeUrl": resume.asset->url,
    workPage{heading, intro},
    contactPage{heading, intro, budgetOptions, successMessage},
    seo{titleTemplate, description, ogImage{${imageFields}}},
    footerText
  }
`)

/* --------------------------------- home --------------------------------- */

export const HOME_QUERY = defineQuery(`
  {
    "page": *[_type == "homePage" && _id == "homePage"][0]{
      hero{
        eyebrow,
        headline,
        highlight,
        subheadline,
        primaryCta{label, href},
        secondaryCta{label, href},
        mediaType,
        image{${imageFields}},
        "videoUrl": video.asset->url,
        statChips[]{_key, value, label}
      },
      sections[]{_key, section, enabled, eyebrow, heading, intro},
      seo{${seoFields}}
    },
    "clients": *[_type == "client" && showInLogoWall != false] | order(orderRank asc){
      _id,
      name,
      website,
      logo{${imageFields}}
    },
    "stats": *[_type == "stat"] | order(orderRank asc){_id, label, value, suffix, description},
    "featuredWork": *[_type == "caseStudy" && featured == true && defined(slug.current)]
      | order(orderRank asc)[0...6]{${caseStudyCardFields}},
    "feed": *[_type == "contentPiece" && featured != false]
      | order(orderRank asc)[0...24]{${feedItemFields}},
    "services": *[_type == "service"] | order(orderRank asc){
      _id,
      title,
      icon,
      description,
      deliverables,
      startingPrice
    },
    "testimonials": *[_type == "testimonial"] | order(orderRank asc){${testimonialFields}},
    "tools": *[_type == "tool"] | order(orderRank asc){_id, name, category, logo{${imageFields}}}
  }
`)

/* --------------------------------- work --------------------------------- */

export const WORK_INDEX_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)] | order(orderRank asc){
    ${caseStudyCardFields}
  }
`)

export const CASE_STUDY_SLUGS_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)]{"slug": slug.current}
`)

export const CASE_STUDY_QUERY = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    industry,
    platforms,
    timeframe,
    summary,
    cover{${imageFields}},
    "client": client->{name, website, logo{${imageFields}}},
    challenge,
    strategy,
    execution[]{
      ...,
      _type == "figure" => {
        "lqip": asset->metadata.lqip,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      },
      _type == "videoFile" => {
        "url": file.asset->url,
        poster{${imageFields}}
      }
    },
    results[]{_key, label, value, prefix, suffix, change, timeframe},
    gallery[]{_key, caption, ${imageFields}},
    "testimonial": testimonial->{${testimonialFields}},
    "relatedContent": *[_type == "contentPiece" && references(^._id)]
      | order(orderRank asc)[0...8]{${feedItemFields}},
    "previous": *[_type == "caseStudy" && defined(slug.current) && orderRank < ^.orderRank]
      | order(orderRank desc)[0]{title, "slug": slug.current, cover{${imageFields}}},
    "next": *[_type == "caseStudy" && defined(slug.current) && orderRank > ^.orderRank]
      | order(orderRank asc)[0]{title, "slug": slug.current, cover{${imageFields}}},
    seo{${seoFields}}
  }
`)

/** A light version of the case study used for metadata and social images. */
export const CASE_STUDY_META_QUERY = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0]{
    title,
    summary,
    industry,
    "clientName": client->name,
    cover{${imageFields}},
    results[0...3]{_key, label, value, prefix, suffix},
    seo{${seoFields}}
  }
`)

/* --------------------------------- about -------------------------------- */

export const ABOUT_QUERY = defineQuery(`
  {
    "page": *[_type == "aboutPage" && _id == "aboutPage"][0]{
      headline,
      portrait{${imageFields}},
      bio,
      approachHeading,
      approach[]{_key, title, description},
      experienceHeading,
      experience[]{_key, role, company, period, description},
      languagesHeading,
      languages[]{_key, name, level, note},
      valuesHeading,
      values[]{_key, title, description},
      seo{${seoFields}}
    },
    "certifications": *[_type == "certification"] | order(orderRank asc){
      _id,
      title,
      issuer,
      year,
      credentialUrl,
      badge{${imageFields}}
    },
    "tools": *[_type == "tool"] | order(orderRank asc){_id, name, category, logo{${imageFields}}}
  }
`)

/* -------------------------------- contact ------------------------------- */

export const CONTACT_QUERY = defineQuery(`
  {
    "services": *[_type == "service"] | order(orderRank asc){_id, title}
  }
`)

/* ---------------------------------- seo --------------------------------- */

export const SITEMAP_QUERY = defineQuery(`
  {
    "home": *[_type == "homePage" && _id == "homePage"][0]._updatedAt,
    "about": *[_type == "aboutPage" && _id == "aboutPage"][0]._updatedAt,
    "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]._updatedAt,
    "caseStudies": *[_type == "caseStudy" && defined(slug.current)] | order(orderRank asc){
      "slug": slug.current,
      _updatedAt
    }
  }
`)
