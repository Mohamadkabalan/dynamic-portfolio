import {encodeSignatureHeader, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {NextRequest} from 'next/server'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const revalidateTag = vi.fn()
vi.mock('next/cache', () => ({revalidateTag: (...args: unknown[]) => revalidateTag(...args)}))

const SECRET = 'test-secret-do-not-use-in-production'
const URL = 'https://example.com/api/revalidate'

async function signedRequest(payload: unknown, secret = SECRET): Promise<NextRequest> {
  const body = JSON.stringify(payload)
  const signature = await encodeSignatureHeader(body, Date.now(), secret)
  return new NextRequest(URL, {
    method: 'POST',
    body,
    headers: {'content-type': 'application/json', [SIGNATURE_HEADER_NAME]: signature},
  })
}

async function loadRoute() {
  return import('@/app/api/revalidate/route')
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    revalidateTag.mockReset()
    vi.stubEnv('SANITY_REVALIDATE_SECRET', SECRET)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('returns 401 when the signature header is missing', async () => {
    const {POST} = await loadRoute()
    const request = new NextRequest(URL, {
      method: 'POST',
      body: JSON.stringify({_type: 'caseStudy', slug: 'hello'}),
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('returns 401 when the request was signed with the wrong secret', async () => {
    const {POST} = await loadRoute()
    const request = await signedRequest({_type: 'caseStudy', slug: 'hello'}, 'wrong-secret')

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('returns 401 when the body was tampered with after signing', async () => {
    const {POST} = await loadRoute()
    const signature = await encodeSignatureHeader(
      JSON.stringify({_type: 'stat'}),
      Date.now(),
      SECRET,
    )
    const request = new NextRequest(URL, {
      method: 'POST',
      body: JSON.stringify({_type: 'caseStudy', slug: 'hello'}),
      headers: {[SIGNATURE_HEADER_NAME]: signature},
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('returns 401 when the signature header is malformed', async () => {
    const {POST} = await loadRoute()
    const request = new NextRequest(URL, {
      method: 'POST',
      body: JSON.stringify({_type: 'caseStudy'}),
      headers: {[SIGNATURE_HEADER_NAME]: 'not-a-real-signature'},
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('revalidates the type and slug tags when the signature is valid', async () => {
    const {POST} = await loadRoute()
    const request = await signedRequest({
      _type: 'caseStudy',
      slug: 'new-title',
      previousSlug: 'old-title',
    })

    const response = await POST(request)
    const json = (await response.json()) as {revalidated: boolean; tags: string[]}

    expect(response.status).toBe(200)
    expect(json.revalidated).toBe(true)
    expect(json.tags).toEqual(['caseStudy', 'caseStudy:new-title', 'caseStudy:old-title'])
    expect(revalidateTag.mock.calls).toEqual([
      ['caseStudy', {expire: 0}],
      ['caseStudy:new-title', {expire: 0}],
      ['caseStudy:old-title', {expire: 0}],
    ])
  })

  it('returns 400 for a validly signed payload with an unknown document type', async () => {
    const {POST} = await loadRoute()
    const request = await signedRequest({_type: 'somethingElse'})

    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('returns 500 when the server has no secret configured', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', '')
    const {POST} = await loadRoute()
    const request = await signedRequest({_type: 'caseStudy'})

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
