/**
 * One-off clean-up for the move to a single-page site (November 2026).
 *
 * The "Work page" and "Contact page" texts in Site settings are no longer
 * used: the Work and Contact sections take their headings from the page
 * sections list instead. This removes those fields so the Studio does not
 * flag them as unknown. Safe to run more than once.
 *
 *   npx sanity exec scripts/migrations/one-page.ts --with-user-token
 */
import {createClient} from '@sanity/client'

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

const client = createClient({projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false})
const REMOVED = ['workPage', 'contactPage.heading', 'contactPage.intro']

async function main() {
  for (const id of ['siteSettings', 'drafts.siteSettings']) {
    const exists = await client.fetch<boolean>('defined(*[_id == $id][0])', {id})
    if (!exists) continue
    await client.patch(id).unset(REMOVED).commit()
    console.log(`${id}: removed ${REMOVED.join(', ')}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
