import type {Metadata} from 'next'
import type {ReactNode} from 'react'

import {Hero} from '@/components/sections/Hero'
import {
  ContactCta,
  FeaturedWork,
  FeedSection,
  ServicesSection,
  ToolsSection,
  type SectionCopy,
} from '@/components/sections/HomeSections'
import {LogoMarquee} from '@/components/sections/LogoMarquee'
import {StatsBand} from '@/components/sections/StatsBand'
import {TestimonialStories} from '@/components/sections/TestimonialStories'
import {SetupNotice} from '@/components/shell/SetupNotice'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {JsonLd, personJsonLd} from '@/lib/jsonld'
import {pageMetadata} from '@/lib/metadata'
import {isSanityConfigured} from '@/sanity/env'
import {HOME_SECTIONS, type HomeSectionValue} from '@/sanity/lib/constants'
import {getHomeData, getSiteSettings} from '@/sanity/lib/data'

/** Headings used when the editor leaves a section's heading empty. */
const DEFAULT_COPY: Record<HomeSectionValue, SectionCopy> = {
  logos: {heading: 'Trusted by brands that care about community'},
  stats: {eyebrow: 'By the numbers', heading: 'Results that travel beyond the feed.'},
  featuredWork: {eyebrow: 'Selected work', heading: 'Case studies'},
  feed: {eyebrow: 'The feed', heading: 'Content, as it lived on the timeline.'},
  services: {eyebrow: 'Services', heading: 'How I can help'},
  testimonials: {eyebrow: 'Kind words', heading: 'What clients say'},
  tools: {eyebrow: 'Toolkit', heading: 'The tools behind the work'},
  contactCta: {
    eyebrow: 'Next step',
    heading: 'Have a brand that deserves a louder room?',
    intro: 'Tell me where you are and where you want to be. I reply within two working days.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHomeData(), getSiteSettings()])
  return pageMetadata({settings, seo: home?.page?.seo, path: '/', absoluteTitle: true})
}

export default async function HomePage() {
  if (!isSanityConfigured) return <SetupNotice state="connect" />

  const [home, settings] = await Promise.all([getHomeData(), getSiteSettings()])
  const page = home?.page
  const hero = page?.hero
  if (!home || !page || !hero?.headline) return <SetupNotice state="content" />

  // The editor controls order and visibility; with no list yet, show everything.
  const configured = (page.sections ?? []).filter((item) => item.section)
  const order =
    configured.length > 0
      ? configured
      : HOME_SECTIONS.map((item) => ({
          _key: item.value,
          section: item.value,
          enabled: true,
          eyebrow: null,
          heading: null,
          intro: null,
        }))

  const sections = order
    .filter((item) => item.enabled !== false)
    .map((item): ReactNode => {
      const defaults = DEFAULT_COPY[item.section]
      const copy: SectionCopy = {
        eyebrow: item.eyebrow ?? defaults.eyebrow,
        heading: item.heading?.trim() || defaults.heading,
        intro: item.intro ?? defaults.intro,
      }

      switch (item.section) {
        case 'logos':
          return <LogoMarquee key={item._key} clients={home.clients} heading={copy.heading} />
        case 'stats':
          return <StatsBand key={item._key} stats={home.stats} {...copy} />
        case 'featuredWork':
          return <FeaturedWork key={item._key} studies={home.featuredWork} copy={copy} />
        case 'feed':
          return <FeedSection key={item._key} items={home.feed} copy={copy} />
        case 'services':
          return <ServicesSection key={item._key} services={home.services} copy={copy} />
        case 'testimonials':
          return home.testimonials.length > 0 ? (
            <section
              key={item._key}
              aria-labelledby="testimonials-heading"
              className="border-t border-line"
            >
              <div className="shell section-y">
                <SectionHeading id="testimonials-heading" {...copy} />
                <div className="mt-10 md:mt-14">
                  <TestimonialStories testimonials={home.testimonials} />
                </div>
              </div>
            </section>
          ) : null
        case 'tools':
          return <ToolsSection key={item._key} tools={home.tools} copy={copy} />
        case 'contactCta':
          return <ContactCta key={item._key} copy={copy} email={settings?.contactEmail} />
        default:
          return null
      }
    })

  return (
    <>
      <JsonLd data={personJsonLd(settings)} />
      <Hero hero={hero} settings={settings} />
      {sections}
    </>
  )
}
