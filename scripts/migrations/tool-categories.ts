/**
 * Tool categories became documents the editor can manage (Library → Tool
 * categories). This creates the five original categories and points every
 * tool that still stores the old text value ("design") at the matching
 * category document. Drafts are migrated too. Safe to run more than once.
 *
 *   npx sanity exec scripts/migrations/tool-categories.ts --with-user-token
 */
import {createClient} from '@sanity/client'
import {LexoRank} from 'lexorank'

import {TOOL_CATEGORIES, toolCategoryId} from '../../sanity/lib/constants'

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

async function main() {
  // 1. The original categories, in their original order (kept if they already exist).
  let rank = LexoRank.min()
  const categories = client.transaction()
  for (const category of TOOL_CATEGORIES) {
    rank = rank.genNext().genNext()
    categories.createIfNotExists({
      _id: toolCategoryId(category.value),
      _type: 'toolCategory',
      name: category.title,
      orderRank: rank.toString(),
    })
  }
  await categories.commit()
  console.log(`Categories in place: ${TOOL_CATEGORIES.map((category) => category.title).join(', ')}`)

  // 2. Tools that still hold the old text value.
  const tools = await client.fetch<Array<{_id: string; name: string | null; category: unknown}>>(
    `*[_type == "tool" && defined(category) && !defined(category._ref)]{_id, name, category}`,
  )
  if (tools.length === 0) {
    console.log('Every tool already points at a category document. Nothing else to do.')
    return
  }

  for (const tool of tools) {
    if (typeof tool.category !== 'string') continue
    const _ref = toolCategoryId(tool.category)
    await client.patch(tool._id).set({category: {_type: 'reference', _ref}}).commit()
    console.log(`${tool._id} "${tool.name}": ${tool.category} → ${_ref}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
