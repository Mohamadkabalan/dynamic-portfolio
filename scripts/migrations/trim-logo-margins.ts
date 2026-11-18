/**
 * Client logos are often exported with a wide empty margin around a small
 * mark, which makes them tiny in the logo strip. This measures that margin
 * in every client logo and saves it as the image's crop, exactly as if the
 * editor had dragged the crop handles in the Studio. The original file is
 * untouched and the crop can be changed or removed in the Studio at any time.
 * Logos that are already tight, or that the editor has cropped to a similar
 * size, are left alone. Drafts are handled too.
 *
 *   DRY_RUN=1 npx sanity exec scripts/migrations/trim-logo-margins.ts --with-user-token   (report only)
 *   npx sanity exec scripts/migrations/trim-logo-margins.ts --with-user-token
 */
import {createClient} from '@sanity/client'
import sharp, {type OutputInfo} from 'sharp'

for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // The file is optional.
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
const dryRun = Boolean(process.env.DRY_RUN)

if (!projectId || !token) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and a write token (or run with --with-user-token).')
  process.exit(1)
}

// "raw" so drafts are included as well as published documents.
const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-10-01',
  useCdn: false,
  perspective: 'raw',
})

/** Breathing room kept around the mark, as a share of the trimmed box. */
const MARGIN = 0.08
/** Below this share of the image, a margin is not worth cropping. */
const MIN_TRIM = 0.1
/** How different from the corner colour a pixel must be to count as content. */
const THRESHOLD = 24

interface Crop {
  top: number
  bottom: number
  left: number
  right: number
}

interface ClientDoc {
  _id: string
  name: string | null
  url: string | null
  width: number | null
  height: number | null
  crop: Crop | null
}

const round = (value: number) => Math.round(value * 1000) / 1000
const clamp = (value: number) => Math.min(1, Math.max(0, value))
const pct = (value: number) => `${Math.round(value * 100)}%`
const kept = (crop: Crop) => ({
  width: 1 - crop.left - crop.right,
  height: 1 - crop.top - crop.bottom,
})

async function measure(doc: ClientDoc): Promise<Crop | null> {
  if (!doc.url || !doc.width || !doc.height) return null
  const response = await fetch(doc.url)
  if (!response.ok) throw new Error(`${doc.name}: download failed (${response.status})`)
  const original = Buffer.from(await response.arrayBuffer())

  let info: OutputInfo
  try {
    ;({info} = await sharp(original).trim({threshold: THRESHOLD}).toBuffer({resolveWithObject: true}))
  } catch {
    return null // Nothing to trim (a flat image), or an unsupported file.
  }
  const box = {
    left: -(info.trimOffsetLeft ?? 0),
    top: -(info.trimOffsetTop ?? 0),
    width: info.width,
    height: info.height,
  }
  if (box.width <= 0 || box.height <= 0) return null

  const pad = Math.round(Math.max(box.width, box.height) * MARGIN)
  const W = doc.width
  const H = doc.height
  const crop: Crop = {
    left: round(clamp((box.left - pad) / W)),
    top: round(clamp((box.top - pad) / H)),
    right: round(clamp((W - (box.left + box.width + pad)) / W)),
    bottom: round(clamp((H - (box.top + box.height + pad)) / H)),
  }
  const trimmed = Math.max(crop.left + crop.right, crop.top + crop.bottom)
  return trimmed < MIN_TRIM ? null : crop
}

async function main() {
  const docs = await client.fetch<ClientDoc[]>(
    `*[_type == "client" && defined(logo.asset)]{
      _id, name,
      "url": logo.asset->url,
      "width": logo.asset->metadata.dimensions.width,
      "height": logo.asset->metadata.dimensions.height,
      "crop": logo.crop
    }`,
  )
  console.log(`${docs.length} logo${docs.length === 1 ? '' : 's'} to look at${dryRun ? ' (dry run, nothing is saved)' : ''}.`)

  for (const doc of docs) {
    const label = `${doc._id} "${doc.name}"`
    const crop = await measure(doc)
    if (!crop) {
      console.log(`${label}: already tight, left alone.`)
      continue
    }
    const next = kept(crop)

    if (doc.crop && (doc.crop.left || doc.crop.right || doc.crop.top || doc.crop.bottom)) {
      // Keep the editor's own crop unless it still leaves most of the margin in place.
      const current = kept(doc.crop)
      if (next.width > current.width * 0.7 && next.height > current.height * 0.7) {
        console.log(`${label}: cropped in the Studio already, left alone.`)
        continue
      }
      console.log(`${label}: the Studio crop kept ${pct(current.width)} × ${pct(current.height)}, replacing it.`)
    }

    console.log(
      `${label}: keep ${pct(next.width)} × ${pct(next.height)} ` +
        `(trim left ${pct(crop.left)}, top ${pct(crop.top)}, right ${pct(crop.right)}, bottom ${pct(crop.bottom)})`,
    )
    if (dryRun) continue
    await client
      .patch(doc._id)
      .set({
        'logo.crop': {_type: 'sanity.imageCrop', ...crop},
        // The focus point sits in the middle of the crop.
        'logo.hotspot': {
          _type: 'sanity.imageHotspot',
          x: round((crop.left + (1 - crop.right)) / 2),
          y: round((crop.top + (1 - crop.bottom)) / 2),
          width: round(next.width),
          height: round(next.height),
        },
      })
      .commit()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
