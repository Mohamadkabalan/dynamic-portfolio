/**
 * Repairs case studies whose "page address" is not a valid slug — typically a
 * pasted link such as https://www.instagram.com/… The address is rebuilt
 * from the title (as the Studio's "Generate" button would), and a pasted link
 * is kept in the "Link to the work online" field so nothing is lost.
 * Drafts are repaired too. Safe to run more than once.
 *
 *   npx sanity exec scripts/migrations/fix-slugs.ts --with-user-token
 */
import {createClient} from '@sanity/client'

import {isValidSlug, slugify} from '../../sanity/lib/slug'

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

interface Study {
  _id: string
  title: string | null
  slug: string | null
  liveUrl: string | null
}

async function main() {
  const studies = await client.fetch<Study[]>(
    `*[_type == "caseStudy"]{_id, title, "slug": slug.current, liveUrl}`,
  )
  const broken = studies.filter((study) => study.slug && !isValidSlug(study.slug))
  if (broken.length === 0) {
    console.log('All case study addresses are valid. Nothing to do.')
    return
  }

  const taken = new Set(studies.map((study) => study.slug).filter(isValidSlug))

  for (const study of broken) {
    let slug = slugify(study.title ?? '') || 'case-study'
    for (let n = 2; taken.has(slug); n += 1) slug = `${slugify(study.title ?? '') || 'case-study'}-${n}`
    taken.add(slug)

    const isLink = /^https?:\/\//i.test(study.slug ?? '')
    const patch = client.patch(study._id).set({'slug.current': slug})
    if (isLink && !study.liveUrl) patch.set({liveUrl: study.slug})
    await patch.commit()

    console.log(
      `${study._id} "${study.title}": address → ${slug}${isLink && !study.liveUrl ? ' (old link kept as "Link to the work online")' : ''}`,
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
