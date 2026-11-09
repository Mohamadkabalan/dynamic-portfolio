import {createClient} from 'next-sanity'

import {apiHost, apiVersion, dataset, safeProjectId} from '../env'

/**
 * The read-only Sanity client used by the website.
 * `useCdn: true` reads from Sanity's fast global API CDN; freshness is handled
 * by tag-based revalidation (see `live.ts` and `app/api/revalidate`).
 */
export const client = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // Only set by `npm run dev:mock` (a local stand-in for Sanity's API).
  ...(apiHost ? {apiHost, useProjectHostname: false} : {}),
})
