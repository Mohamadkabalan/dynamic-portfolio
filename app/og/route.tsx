import {siteCard} from '@/lib/og'
import {siteName, siteTitle} from '@/lib/site'
import {siteUrl} from '@/sanity/env'
import {getSiteSettings} from '@/sanity/lib/data'

/**
 * GET /og — the default social-sharing image, drawn from Site settings.
 * It is generated once, cached, and regenerated when the settings change.
 */
export const dynamic = 'force-static'

export async function GET() {
  const settings = await getSiteSettings()
  return siteCard({
    name: siteName(settings),
    title: siteTitle(settings),
    accentColor: settings?.accentColor,
    domain: new URL(siteUrl).host,
  })
}
