/**
 * Fills the Sanity dataset with sample content.
 *
 *   npm run seed            → uploads images and writes the documents
 *   npm run seed -- --dry   → renders the images to .seed-preview/ only
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_API_WRITE_TOKEN (an "Editor" token) in `.env.local`.
 *
 * Safe to run more than once: every document has a fixed ID and is replaced in
 * place, and Sanity recognises identical image files instead of storing copies.
 * Note that it overwrites the sample documents — including any edits you made
 * to them — so use it at the start, not after you have added real content.
 */
import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'

import {loadEnvConfig} from '@next/env'
import {createClient} from '@sanity/client'

import {buildDocuments, IMAGE_SPECS, type ImageResolver} from './content'
import {renderImage, type RenderedImage} from './images'
import {withRanks} from './rank'

loadEnvConfig(process.cwd())

const isDryRun = process.argv.includes('--dry') || process.argv.includes('--dry-run')

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

/** Runs async work a few items at a time. */
async function inBatches<T, R>(items: T[], size: number, work: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = []
  for (let start = 0; start < items.length; start += size) {
    results.push(...(await Promise.all(items.slice(start, start + size).map(work))))
  }
  return results
}

async function dryRun(images: RenderedImage[]) {
  const directory = join(process.cwd(), '.seed-preview')
  await mkdir(directory, {recursive: true})
  await Promise.all(images.map((image) => writeFile(join(directory, image.filename), image.buffer)))

  const documents = withRanks(
    buildDocuments((key, alt) => ({_type: 'image', asset: {_type: 'reference', _ref: `image-${key}`}, alt})),
  )
  const counts = new Map<string, number>()
  for (const document of documents) counts.set(document._type, (counts.get(document._type) ?? 0) + 1)

  console.log(`\nDry run — nothing was sent to Sanity.`)
  console.log(`  ${images.length} images written to ${directory}`)
  console.log(`  ${documents.length} documents would be written:`)
  for (const [type, count] of counts) console.log(`    ${String(count).padStart(3)} × ${type}`)
}

async function main() {
  console.log(`Rendering ${IMAGE_SPECS.length} placeholder images…`)
  const images = await inBatches(IMAGE_SPECS, 6, renderImage)

  if (isDryRun) return dryRun(images)

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!projectId) fail('NEXT_PUBLIC_SANITY_PROJECT_ID is missing. Add it to .env.local (see .env.example).')
  if (!token) {
    fail(
      'SANITY_API_WRITE_TOKEN is missing. Create a token with "Editor" permissions at\n' +
        '  https://www.sanity.io/manage → your project → API → Tokens\n' +
        'and add it to .env.local. Never commit this token.',
    )
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-01',
    useCdn: false,
  })

  console.log(`Uploading images to ${projectId}/${dataset}…`)
  const assetIds = new Map<string, string>()
  await inBatches(images, 4, async (image) => {
    const asset = await client.assets.upload('image', image.buffer, {
      filename: image.filename,
      contentType: image.contentType,
    })
    assetIds.set(image.key, asset._id)
  })

  const resolveImage: ImageResolver = (key, alt) => {
    const assetId = assetIds.get(key)
    if (!assetId) throw new Error(`No image was generated for "${key}".`)
    return {_type: 'image', asset: {_type: 'reference', _ref: assetId}, alt}
  }

  const documents = withRanks(buildDocuments(resolveImage))
  console.log(`Writing ${documents.length} documents…`)

  const transaction = client.transaction()
  for (const document of documents) transaction.createOrReplace(document)
  await transaction.commit()

  console.log(`\n✔ Done. ${documents.length} documents and ${images.length} images are in ${projectId}/${dataset}.`)
  console.log('  Open /studio to edit them. You can now delete the write token from sanity.io/manage.')
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  fail(`The seed did not finish: ${message}`)
})
