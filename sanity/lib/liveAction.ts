'use server'

import {updateTag} from 'next/cache'
import {parseTags} from 'next-sanity/live'

/**
 * Called by `<SanityLive />` in a visitor's browser whenever content is
 * published. It expires the cache entries that depend on the changed content.
 *
 * next-sanity v13's built-in action uses stale-while-revalidate, which means an
 * open page can keep showing the old content until the next navigation.
 * `updateTag` expires the entries immediately, and because this runs as a
 * Server Action, Next.js re-renders the open page with fresh data in the same
 * round trip — so the edit appears within seconds, with no reload.
 *
 * `parseTags` only accepts tags produced by `sanityFetch` (prefixed `sanity:`),
 * so this cannot be used to expire arbitrary cache entries.
 */
export async function expireSanityTags(unsafeTags: unknown): Promise<void> {
  const {tags} = parseTags(unsafeTags)
  for (const tag of tags) {
    updateTag(tag)
  }
}
