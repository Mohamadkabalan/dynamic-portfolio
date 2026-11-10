import type {Metadata} from 'next'
import type {ReactNode} from 'react'

import {AboutSection} from '@/components/sections/AboutSection'
import {ContactSection} from '@/components/sections/ContactSection'
import {Hero} from '@/components/sections/Hero'
import {
  FeedSection,
  ServicesSection,
  ToolsSection,
  type SectionCopy,
} from '@/components/sections/HomeSections'
import {LogoMarquee} from '@/components/sections/LogoMarquee'
import {StatsBand} from '@/components/sections/StatsBand'
import {TestimonialStories} from '@/components/sections/TestimonialStories'
import {WorkSection} from '@/components/sections/WorkSection'
import {SetupNotice} from '@/components/shell/SetupNotice'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {JsonLd, personJsonLd} from '@/lib/jsonld'
import {pageMetadata} from '@/lib/metadata'
import {isSanityConfigured} from '@/sanity/env'
import {HOME_SECTIONS, type HomeSectionValue} from '@/sanity/lib/constants'
import {
  getAboutData,
  getContactData,
  getHomeData,
  getSiteSettings,
  getWorkIndex,
  type HomeData,
} from '@/sanity/lib/data'

type SectionRow = NonNullable<NonNullable<HomeData['page']>['sections']>[number]

/** Headings used when the editor leaves a section's heading empty. */
const DEFAULT_COPY: Record<HomeSectionValue, SectionCopy> = {
  logos: {heading: 'Trusted by brands that care about community'},
  stats: {eyebrow: 'By the numbers', heading: 'Results that travel beyond the feed.'},
  featuredWork: {eyebrow: 'Case studies', heading: 'Work that earns the scroll-stop.'},
  feed: {eyebrow: 'The feed', heading: 'Content, as it lived on the timeline.'},
  services: {eyebrow: 'Services', heading: 'How I can help'},
  testimonials: {eyebrow: 'Kind words', heading: 'What clients say'},
  // The About section brings its own headline (see the About section document).
  about: {heading: 'About'},
  tools: {eyebrow: 'Toolkit', heading: 'The tools behind the work'},
  contactCta: {
    eyebrow: 'Contact',
    heading: 'Let’s build something people talk about.',
    intro:
      'Share a few details about your brand and goals. I read every message and reply within two working days.',
  },
}

/** A row for a section the editor has not configured. */
function blankRow(section: HomeSectionValue): SectionRow {
  return {_key: section, section, enabled: true, eyebrow: null, heading: null, intro: null}
}

/**
 * Work, About and Contact are always on the page because the menu links to
 * them. When the editor has not added a row for one of them, it takes a
 * default place: Work after the stats, About before Contact, Contact last.
 */
function withNavigationSections(rows: SectionRow[]): SectionRow[] {
  const result = [...rows]
  const indexOf = (section: HomeSectionValue) => result.findIndex((row) => row.section === section)

  if (indexOf('featuredWork') < 0) {
    result.splice(Math.max(indexOf('stats'), indexOf('logos')) + 1, 0, blankRow('featuredWork'))
  }
  if (indexOf('contactCta') < 0) result.push(blankRow('contactCta'))
  if (indexOf('about') < 0) result.splice(indexOf('contactCta'), 0, blankRow('about'))
  return result
}

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHomeData(), getSiteSettings()])
  return pageMetadata({settings, seo: home?.page?.seo, path: '/', absoluteTitle: true})
}

/** The whole site on one page: the hero, then the sections in the order set in the CMS. */
export default async function HomePage() {
  if (!isSanityConfigured) return <SetupNotice state="connect" />

  const [home, studies, about, contact, settings] = await Promise.all([
    getHomeData(),
    getWorkIndex(),
    getAboutData(),
    getContactData(),
    getSiteSettings(),
  ])
  const page = home?.page
  const hero = page?.hero
  if (!home || !page || !hero?.headline) return <SetupNotice state="content" />

  // The editor controls order and visibility; with no list yet, show everything.
  const configured = (page.sections ?? []).filter((item) => item.section)
  const order = withNavigationSections(
    configured.length > 0 ? configured : HOME_SECTIONS.map((item) => blankRow(item.value)),
  )
  const services = (contact?.services ?? []).map((service) => service.title)

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
          return <WorkSection key={item._key} studies={studies} copy={copy} />
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
        case 'about':
          return about ? <AboutSection key={item._key} about={about} settings={settings} /> : null
        case 'tools':
          return <ToolsSection key={item._key} tools={home.tools} copy={copy} />
        case 'contactCta':
          return (
            <ContactSection key={item._key} copy={copy} services={services} settings={settings} />
          )
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
