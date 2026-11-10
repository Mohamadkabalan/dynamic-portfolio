import {Mail, MapPin} from 'lucide-react'

import {ContactForm} from '@/components/forms/ContactForm'
import {Reveal} from '@/components/motion/Reveal'
import type {SectionCopy} from '@/components/sections/HomeSections'
import {Availability} from '@/components/shell/Availability'
import {SocialLinks} from '@/components/shell/SocialLinks'
import {Eyebrow} from '@/components/ui/SectionHeading'
import type {SiteSettings} from '@/sanity/lib/data'

const DEFAULT_SUCCESS = 'Thank you! I will get back to you within two working days.'
const DEFAULT_BUDGETS = [
  'Under $1,000 / month',
  '$1,000 – $2,500 / month',
  '$2,500 – $5,000 / month',
  '$5,000+ / month',
  'One-off project',
  'Not sure yet',
]

interface ContactSectionProps {
  copy: SectionCopy
  /** Service titles offered in the form's "What do you need?" field. */
  services: string[]
  settings: SiteSettings | null
}

/** The enquiry form with contact details beside it. The "Contact" link in the menu lands here. */
export function ContactSection({copy, services, settings}: ContactSectionProps) {
  const form = settings?.contactPage
  const budgets = form?.budgetOptions?.filter(Boolean) ?? []
  const email = settings?.contactEmail

  return (
    <section id="contact" aria-labelledby="contact-heading" className="border-t border-line">
      <div className="shell section-y grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <Eyebrow className="mb-6">{copy.eyebrow || 'Contact'}</Eyebrow>
          <h2 id="contact-heading" className="text-display-lg">
            {copy.heading}
          </h2>
          {copy.intro && <p className="text-lead mt-7 max-w-md text-ink-2">{copy.intro}</p>}

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
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <ContactForm
            services={services}
            budgetOptions={budgets.length > 0 ? budgets : DEFAULT_BUDGETS}
            successMessage={form?.successMessage?.trim() || DEFAULT_SUCCESS}
            contactEmail={email}
          />
        </Reveal>
      </div>
    </section>
  )
}
