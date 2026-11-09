import {Mail, MapPin} from 'lucide-react'
import type {Metadata} from 'next'

import {ContactForm} from '@/components/forms/ContactForm'
import {Availability} from '@/components/shell/Availability'
import {SocialLinks} from '@/components/shell/SocialLinks'
import {Eyebrow} from '@/components/ui/SectionHeading'
import {pageMetadata} from '@/lib/metadata'
import {getContactData, getSiteSettings} from '@/sanity/lib/data'

const DEFAULT_HEADING = 'Let’s build something people talk about.'
const DEFAULT_INTRO =
  'Share a few details about your brand and goals. I read every message and reply within two working days.'
const DEFAULT_SUCCESS = 'Thank you! I will get back to you within two working days.'
const DEFAULT_BUDGETS = [
  'Under $1,000 / month',
  '$1,000 – $2,500 / month',
  '$2,500 – $5,000 / month',
  '$5,000+ / month',
  'One-off project',
  'Not sure yet',
]

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return pageMetadata({
    settings,
    title: 'Contact',
    description: settings?.contactPage?.intro || DEFAULT_INTRO,
    path: '/contact',
  })
}

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([getContactData(), getSiteSettings()])
  const copy = settings?.contactPage
  const budgets = copy?.budgetOptions?.filter(Boolean) ?? []
  const email = settings?.contactEmail

  return (
    <section className="shell pb-(--section-y) pt-12 md:pt-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Eyebrow className="mb-6">Contact</Eyebrow>
          <h1 className="text-display-lg motion-safe:animate-rise">
            {copy?.heading?.trim() || DEFAULT_HEADING}
          </h1>
          <p className="text-lead mt-7 max-w-md text-ink-2 motion-safe:animate-rise motion-safe:[animation-delay:80ms]">
            {copy?.intro?.trim() || DEFAULT_INTRO}
          </p>

          <div className="mt-10 space-y-6">
            <Availability
              isAvailable={settings?.availability?.isAvailable}
              text={settings?.availability?.text}
            />
            <ul className="space-y-3">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-11 items-center gap-3 font-medium underline decoration-line-strong underline-offset-4 hover:decoration-accent"
                  >
                    <Mail aria-hidden className="size-5 text-ink-3" />
                    {email}
                  </a>
                </li>
              )}
              {settings?.location && (
                <li className="flex min-h-11 items-center gap-3 text-ink-2">
                  <MapPin aria-hidden className="size-5 text-ink-3" />
                  {settings.location}
                </li>
              )}
            </ul>
            <SocialLinks links={settings?.socialLinks} variant="list" className="max-w-md" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <ContactForm
            services={(contact?.services ?? []).map((service) => service.title)}
            budgetOptions={budgets.length > 0 ? budgets : DEFAULT_BUDGETS}
            successMessage={copy?.successMessage?.trim() || DEFAULT_SUCCESS}
            contactEmail={email}
          />
        </div>
      </div>
    </section>
  )
}
