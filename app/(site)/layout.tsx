import './globals.css'

import type {Metadata, Viewport} from 'next'

import {MotionProvider} from '@/components/motion/MotionProvider'
import {ActiveSectionProvider} from '@/components/shell/ActiveSection'
import {Footer} from '@/components/shell/Footer'
import {Header} from '@/components/shell/Header'
import {accentCss, accentTokens, PAPER_DARK, PAPER_LIGHT} from '@/lib/color'
import {GENERATED_OG_IMAGE} from '@/lib/metadata'
import {siteDescription, siteName, siteTitle, THEME_SCRIPT} from '@/lib/site'
import {isSanityConfigured, siteUrl} from '@/sanity/env'
import {getSiteSettings} from '@/sanity/lib/data'
import {hasAsset, staticImageUrl} from '@/sanity/lib/image'
import {SanityLive} from '@/sanity/lib/live'
import {expireSanityTags} from '@/sanity/lib/liveAction'

import {fontVariables} from './fonts'

/** Site-wide metadata defaults, all driven by Site settings in the CMS. */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const name = siteName(settings)
  const title = siteTitle(settings)
  const description = siteDescription(settings)
  const favicon = settings?.favicon
  const ogImage = settings?.seo?.ogImage

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name} — ${title}`,
      template: settings?.seo?.titleTemplate?.includes('%s')
        ? settings.seo.titleTemplate
        : `%s · ${name}`,
    },
    description,
    applicationName: name,
    authors: [{name}],
    creator: name,
    openGraph: {
      type: 'website',
      siteName: name,
      title: `${name} — ${title}`,
      description,
      url: '/',
      locale: 'en',
      // An uploaded sharing image wins; otherwise one is generated from CMS data.
      images: [
        hasAsset(ogImage)
          ? {
              url: staticImageUrl(ogImage, {width: 1200, height: 630, format: 'jpg'}),
              width: 1200,
              height: 630,
              alt: ogImage.alt || `${name} — ${title}`,
            }
          : {url: GENERATED_OG_IMAGE, width: 1200, height: 630, alt: `${name} — ${title}`},
      ],
    },
    twitter: {card: 'summary_large_image'},
    icons: hasAsset(favicon)
      ? {
          icon: [
            {url: staticImageUrl(favicon, {width: 32, height: 32, format: 'png'}), sizes: '32x32', type: 'image/png'},
            {url: staticImageUrl(favicon, {width: 192, height: 192, format: 'png'}), sizes: '192x192', type: 'image/png'},
          ],
          apple: [{url: staticImageUrl(favicon, {width: 180, height: 180, format: 'png'}), sizes: '180x180'}],
        }
      : {icon: [{url: '/icon.svg', type: 'image/svg+xml'}]},
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: PAPER_LIGHT},
    {media: '(prefers-color-scheme: dark)', color: PAPER_DARK},
  ],
}

/**
 * The root layout for the public website (the Studio has its own).
 * It loads the fonts, applies the accent colour from the CMS, and mounts
 * `<SanityLive />` so open pages update in place when content is published.
 */
export default async function SiteLayout({children}: {children: React.ReactNode}) {
  const settings = await getSiteSettings()
  const tokens = accentTokens(settings?.accentColor)

  return (
    <html lang="en" id="top" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: THEME_SCRIPT}} />
        <style dangerouslySetInnerHTML={{__html: accentCss(tokens)}} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <MotionProvider>
          <ActiveSectionProvider>
            <Header settings={settings} />
          </ActiveSectionProvider>
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer settings={settings} />
        </MotionProvider>
        {isSanityConfigured && <SanityLive action={expireSanityTags} />}
      </body>
    </html>
  )
}
