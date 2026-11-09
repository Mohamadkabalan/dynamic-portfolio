/**
 * Sanity connection settings, read from environment variables.
 * See `.env.example` and the README for where these values come from.
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

/** False until the project ID is set — the site then shows a setup notice instead of crashing. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId)

/**
 * `@sanity/client` refuses to start with an empty project ID, so an obviously
 * fake one is used until the real one is configured. Nothing is fetched with it.
 */
export const safeProjectId = isSanityConfigured ? projectId : 'not-configured'

export const studioBasePath = '/studio'

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL || // set automatically by Netlify to the site's main address
  'http://localhost:3000'
).replace(/\/$/, '')

/**
 * Optional, for local previews only (`npm run dev:mock`): point the site at a
 * local stand-in for Sanity's API and image CDN. Leave both unset in production.
 */
export const apiHost = process.env.NEXT_PUBLIC_SANITY_API_HOST || undefined
export const imageHost = process.env.NEXT_PUBLIC_SANITY_IMAGE_HOST || undefined
