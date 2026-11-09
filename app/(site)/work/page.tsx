import type {Metadata} from 'next'

import {ContactCta} from '@/components/sections/HomeSections'
import {SetupNotice} from '@/components/shell/SetupNotice'
import {Eyebrow} from '@/components/ui/SectionHeading'
import {WorkFilter} from '@/components/work/WorkFilter'
import {pageMetadata} from '@/lib/metadata'
import {isSanityConfigured} from '@/sanity/env'
import {getSiteSettings, getWorkIndex} from '@/sanity/lib/data'

const DEFAULT_HEADING = 'Work that earns the scroll-stop.'
const DEFAULT_INTRO =
  'Strategy, content and community management for brands that want more than vanity metrics. Filter by platform or industry.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return pageMetadata({
    settings,
    title: 'Work',
    description: settings?.workPage?.intro || DEFAULT_INTRO,
    path: '/work',
  })
}

export default async function WorkPage() {
  if (!isSanityConfigured) return <SetupNotice state="connect" />

  const [studies, settings] = await Promise.all([getWorkIndex(), getSiteSettings()])
  const heading = settings?.workPage?.heading?.trim() || DEFAULT_HEADING
  const intro = settings?.workPage?.intro?.trim() || DEFAULT_INTRO

  return (
    <>
      <section className="shell pb-(--section-y) pt-12 md:pt-20">
        <header className="mb-12 max-w-4xl md:mb-16">
          <Eyebrow className="mb-6">
            Case studies{studies.length > 0 && <span className="tabular"> · {studies.length}</span>}
          </Eyebrow>
          <h1 className="text-display-xl motion-safe:animate-rise">{heading}</h1>
          <p className="text-lead mt-7 max-w-2xl text-ink-2 motion-safe:animate-rise motion-safe:[animation-delay:80ms]">
            {intro}
          </p>
        </header>

        {studies.length > 0 ? (
          <WorkFilter studies={studies} />
        ) : (
          <p className="text-lead rounded-xl border border-dashed border-line-strong px-6 py-16 text-center text-ink-2">
            Case studies are on their way. Check back soon.
          </p>
        )}
      </section>

      <ContactCta
        copy={{
          eyebrow: 'Next step',
          heading: 'Want results like these?',
          intro: 'Tell me about your brand and what you want social to do for it.',
        }}
        email={settings?.contactEmail}
      />
    </>
  )
}
