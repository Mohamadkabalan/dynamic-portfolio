import {revalidateTag} from 'next/cache'
import {NextResponse, type NextRequest} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

import {tagsForPayload, type RevalidatePayload} from '@/sanity/lib/tags'

/**
 * Sanity webhook → cache purge.
 *
 * Sanity calls this URL every time a document is created, updated or deleted.
 * The request is signed with a shared secret; once the signature is verified,
 * the cache tags for the affected document type (and slug) are expired, so the
 * next visitor gets freshly rendered pages. This works even when nobody has
 * the site open, and no rebuild or redeploy is involved.
 *
 * Setup (URL, secret, filter, projection) is documented in the README.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      {revalidated: false, message: 'SANITY_REVALIDATE_SECRET is not set on the server.'},
      {status: 500},
    )
  }

  let payload: RevalidatePayload | null
  try {
    // `parseBody` checks the signature and then waits briefly so Sanity's API
    // has the new content before pages are re-rendered.
    const {isValidSignature, body} = await parseBody<RevalidatePayload>(request, secret, true)
    if (!isValidSignature) {
      return NextResponse.json(
        {revalidated: false, message: 'Invalid signature.'},
        {status: 401},
      )
    }
    payload = body
  } catch {
    // A malformed signature header or body is treated the same as a bad signature.
    return NextResponse.json({revalidated: false, message: 'Invalid signature.'}, {status: 401})
  }

  const tags = tagsForPayload(payload)
  if (tags.length === 0) {
    return NextResponse.json(
      {revalidated: false, message: 'The payload has no known document type (_type).'},
      {status: 400},
    )
  }

  for (const tag of tags) {
    // `expire: 0` drops the cached entries immediately: the next request
    // renders fresh content instead of being served a stale copy first.
    revalidateTag(tag, {expire: 0})
  }

  return NextResponse.json({revalidated: true, tags, now: Date.now()})
}
