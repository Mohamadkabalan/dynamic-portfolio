/**
 * A local stand-in for Sanity's API and image CDN — for previews and tests
 * only. It is never used in production.
 *
 * It serves the sample content from scripts/seed (no Sanity account needed):
 *   • GROQ queries            GET|POST /v…/data/query/<dataset>
 *   • live "published" events GET      /v…/data/live/events/<dataset>
 *   • images with resizing    GET      /images/<project>/<dataset>/<file>
 *
 * and a small control API used by the verification script to imitate an
 * editor publishing, creating or deleting a document:
 *   POST /mock/patch  {id, set, webhook?}
 *   POST /mock/create {document, webhook?}
 *   POST /mock/delete {id, webhook?}
 *
 * With `webhook: true` it also calls the site's /api/revalidate with a signed
 * payload, exactly as a Sanity webhook would.
 */
import {createHash} from 'node:crypto'
import {createServer, type IncomingMessage, type ServerResponse} from 'node:http'

import {encodeSignatureHeader, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {evaluate, parse} from 'groq-js'
import sharp from 'sharp'

import {buildDocuments, IMAGE_SPECS, type SeedDocument} from '../seed/content'
import {renderImage, type RenderedImage} from '../seed/images'
import {withRanks} from '../seed/rank'

export interface MockOptions {
  port: number
  /** The site's address, for webhook calls. */
  siteUrl: string
  revalidateSecret: string
  log?: boolean
}

type Doc = SeedDocument & {_createdAt: string; _updatedAt: string; _rev: string}

const EXTENSIONS: Record<RenderedImage['contentType'], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
}

export async function startMockSanity(options: MockOptions) {
  const {port, siteUrl, revalidateSecret, log = true} = options
  const origin = `http://localhost:${port}`
  const say = (message: string) => log && console.log(`[mock-sanity] ${message}`)

  /* ------------------------------ dataset ------------------------------ */

  say(`rendering ${IMAGE_SPECS.length} placeholder images…`)
  const files = new Map<string, RenderedImage>()
  const assetIds = new Map<string, string>()
  const assetDocs: SeedDocument[] = []

  for (const spec of IMAGE_SPECS) {
    const image = await renderImage(spec)
    const hash = createHash('sha1').update(image.buffer).digest('hex')
    const extension = EXTENSIONS[image.contentType]
    const fileName = `${hash}-${image.width}x${image.height}.${extension}`
    const lqip =
      extension === 'svg'
        ? null
        : `data:image/jpeg;base64,${(await sharp(image.buffer).resize(20).jpeg({quality: 40}).toBuffer()).toString('base64')}`

    files.set(fileName, image)
    const id = `image-${hash}-${image.width}x${image.height}-${extension}`
    assetIds.set(spec.key, id)
    assetDocs.push({
      _id: id,
      _type: 'sanity.imageAsset',
      extension,
      mimeType: image.contentType,
      originalFilename: image.filename,
      url: `${origin}/images/mock/production/${fileName}`,
      metadata: {
        lqip,
        dimensions: {
          width: image.width,
          height: image.height,
          aspectRatio: image.width / image.height,
        },
      },
    })
  }

  const now = () => new Date().toISOString()
  let revision = 0
  const stamp = (doc: SeedDocument, createdAt?: string): Doc => ({
    ...doc,
    _createdAt: createdAt ?? now(),
    _updatedAt: now(),
    _rev: `mock-${++revision}`,
  })

  const seedDocs = withRanks(
    buildDocuments((key, alt) => {
      const assetId = assetIds.get(key)
      if (!assetId) throw new Error(`No image for "${key}"`)
      return {_type: 'image', asset: {_type: 'reference', _ref: assetId}, alt}
    }),
  )
  const dataset = new Map<string, Doc>()
  for (const doc of [...assetDocs, ...seedDocs]) dataset.set(doc._id, stamp(doc))

  /* ---------------------------- live events ---------------------------- */

  const listeners = new Set<ServerResponse>()
  let eventId = 0

  const syncTag = (type: string) => `s1:${type}`

  function broadcast(types: string[]) {
    const tags = [...new Set(types)].map(syncTag)
    const payload = `event: message\nid: ${++eventId}\ndata: ${JSON.stringify({tags})}\n\n`
    for (const listener of listeners) listener.write(payload)
    say(`live event → ${tags.join(', ')} (${listeners.size} listener${listeners.size === 1 ? '' : 's'})`)
  }

  async function callWebhook(payload: Record<string, unknown>) {
    const body = JSON.stringify(payload)
    const signature = await encodeSignatureHeader(body, Date.now(), revalidateSecret)
    const response = await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {'content-type': 'application/json', [SIGNATURE_HEADER_NAME]: signature},
      body,
    })
    say(`webhook → ${response.status} ${await response.text()}`)
    return response.status
  }

  /* ------------------------------ helpers ------------------------------ */

  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
  }

  function json(response: ServerResponse, status: number, body: unknown) {
    response.writeHead(status, {'content-type': 'application/json', ...cors})
    response.end(JSON.stringify(body))
  }

  async function readBody(request: IncomingMessage): Promise<string> {
    const chunks: Buffer[] = []
    for await (const chunk of request) chunks.push(chunk as Buffer)
    return Buffer.concat(chunks).toString('utf8')
  }

  async function runQuery(query: string, params: Record<string, unknown>) {
    const started = Date.now()
    const tree = parse(query, {params})
    const value = await evaluate(tree, {dataset: [...dataset.values()], params})
    const result: unknown = await value.get()
    // Real sync tags are opaque; one per document type is enough to exercise
    // the same cache-tag → live-event → revalidation path.
    const types = new Set([...query.matchAll(/_type\s*==\s*"([^"]+)"/g)].map((match) => match[1]))
    return {result, syncTags: [...types].map(syncTag), ms: Date.now() - started}
  }

  async function serveImage(url: URL, request: IncomingMessage, response: ServerResponse) {
    const fileName = decodeURIComponent(url.pathname.split('/').pop() ?? '')
    const file = files.get(fileName)
    if (!file) return json(response, 404, {error: 'Image not found'})

    const headers = {...cors, 'cache-control': 'public, max-age=31536000, immutable'}
    if (file.contentType === 'image/svg+xml') {
      response.writeHead(200, {...headers, 'content-type': file.contentType})
      return response.end(file.buffer)
    }

    const number = (name: string) => {
      const value = Number(url.searchParams.get(name))
      return Number.isFinite(value) && value > 0 ? Math.round(value) : undefined
    }
    let pipeline = sharp(file.buffer)
    const rect = url.searchParams.get('rect')?.split(',').map(Number)
    if (rect && rect.length === 4 && rect.every(Number.isFinite)) {
      const [left, top, width, height] = rect.map(Math.round)
      pipeline = pipeline.extract({
        left: Math.max(0, left),
        top: Math.max(0, top),
        width: Math.min(width, file.width - Math.max(0, left)),
        height: Math.min(height, file.height - Math.max(0, top)),
      })
    }
    const width = number('w')
    const height = number('h')
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: width && height ? 'cover' : 'inside',
        withoutEnlargement: true,
      })
    }
    const quality = number('q') ?? 75
    const format = url.searchParams.get('fm')
    const wantsWebp =
      !format && url.searchParams.get('auto') === 'format' && (request.headers.accept ?? '').includes('image/webp')

    let contentType = 'image/jpeg'
    if (wantsWebp || format === 'webp') {
      pipeline = pipeline.webp({quality})
      contentType = 'image/webp'
    } else if (format === 'png' || (!format && file.contentType === 'image/png')) {
      pipeline = pipeline.png()
      contentType = 'image/png'
    } else {
      pipeline = pipeline.jpeg({quality, mozjpeg: true})
    }

    response.writeHead(200, {...headers, 'content-type': contentType, vary: 'Accept'})
    response.end(await pipeline.toBuffer())
  }

  /* ------------------------------ server ------------------------------- */

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', origin)
      const path = url.pathname

      if (request.method === 'OPTIONS') {
        response.writeHead(204, cors)
        return response.end()
      }

      if (/^\/v[^/]+\/data\/query\//.test(path)) {
        let query = url.searchParams.get('query') ?? ''
        const params: Record<string, unknown> = {}
        for (const [key, value] of url.searchParams) {
          if (key.startsWith('$')) params[key.slice(1)] = JSON.parse(value)
        }
        if (request.method === 'POST') {
          const body = JSON.parse(await readBody(request)) as {query?: string; params?: Record<string, unknown>}
          query = body.query ?? query
          Object.assign(params, body.params)
        }
        return json(response, 200, await runQuery(query, params))
      }

      if (/^\/v[^/]+\/data\/live\/events\//.test(path)) {
        response.writeHead(200, {
          ...cors,
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache, no-transform',
          connection: 'keep-alive',
        })
        response.write(`event: welcome\ndata: {}\n\n`)
        listeners.add(response)
        request.on('close', () => listeners.delete(response))
        return
      }

      if (/^\/v[^/]+\/check\/cors/.test(path)) {
        return json(response, 200, {result: {allowed: true, withCredentials: true}})
      }

      if (path.startsWith('/images/')) {
        return await serveImage(url, request, response)
      }

      if (request.method === 'POST' && path.startsWith('/mock/')) {
        const body = JSON.parse(await readBody(request)) as {
          id?: string
          set?: Record<string, unknown>
          document?: SeedDocument
          webhook?: boolean
        }
        const action = path.slice('/mock/'.length)
        let before: Doc | undefined
        let after: Doc | undefined

        if (action === 'patch' && body.id) {
          before = dataset.get(body.id)
          if (!before) return json(response, 404, {error: 'No such document'})
          after = stamp({...before, ...body.set}, before._createdAt)
          dataset.set(after._id, after)
        } else if (action === 'create' && body.document) {
          after = stamp(body.document)
          dataset.set(after._id, after)
        } else if (action === 'delete' && body.id) {
          before = dataset.get(body.id)
          if (!before) return json(response, 404, {error: 'No such document'})
          dataset.delete(body.id)
        } else {
          return json(response, 400, {error: 'Unknown mock action'})
        }

        const doc = after ?? before
        const type = doc!._type
        const slugOf = (value: Doc | undefined) =>
          (value?.slug as {current?: string} | undefined)?.current ?? null

        let webhookStatus: number | null = null
        if (body.webhook) {
          webhookStatus = await callWebhook({
            _type: type,
            _id: doc!._id,
            slug: slugOf(after) ?? slugOf(before),
            previousSlug: slugOf(before),
          })
        } else {
          broadcast([type])
        }
        return json(response, 200, {ok: true, action, id: doc!._id, type, webhookStatus})
      }

      if (path === '/mock/health') return json(response, 200, {ok: true, documents: dataset.size})

      json(response, 404, {error: `Mock Sanity has no route for ${path}`})
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      say(`error: ${message}`)
      json(response, 500, {error: message})
    }
  })

  await new Promise<void>((resolve) => server.listen(port, resolve))
  say(`ready on ${origin} with ${seedDocs.length} documents`)

  return {
    origin,
    close: () =>
      new Promise<void>((resolve) => {
        for (const listener of listeners) listener.end()
        server.close(() => resolve())
      }),
  }
}
