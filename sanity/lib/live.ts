import 'server-only'

import {defineLive} from 'next-sanity/live'

import {client} from './client'

/**
 * Optional. Only needed when the dataset is private. It stays on the server:
 * `browserToken` is deliberately disabled so no token ever reaches a visitor.
 */
const token = process.env.SANITY_API_READ_TOKEN

/**
 * `sanityFetch` — every CMS query on the site goes through this. Results are
 * cached and tagged, so pages are served from cache until the content they
 * depend on is published.
 *
 * `<SanityLive />` — rendered once in the site layout. It listens for publish
 * events and refreshes open pages in place.
 */
export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token || false,
  browserToken: false,
})
