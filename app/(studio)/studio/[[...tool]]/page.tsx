/**
 * The Sanity Studio, embedded at /studio.
 * All Studio routes (e.g. /studio/structure/…) are handled by this one page.
 */
import {NextStudio} from 'next-sanity/studio'

import config from '@/sanity.config'
import {isSanityConfigured} from '@/sanity/env'

export const dynamic = 'force-static'

// `metadata` sets robots: noindex so the Studio never shows up in search results.
export {metadata, viewport} from 'next-sanity/studio'

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{fontFamily: 'system-ui, sans-serif', padding: '4rem 1.5rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.6}}>
        <h1 style={{fontSize: '1.5rem'}}>Almost there</h1>
        <p>
          The CMS is not connected yet. Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{' '}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> to your environment variables (see the README),
          then restart the site.
        </p>
      </main>
    )
  }

  return <NextStudio config={config} />
}
