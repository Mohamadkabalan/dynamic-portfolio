import {ArrowUpRight, Check} from 'lucide-react'

import {FeedGrid} from '@/components/feed/FeedGrid'
import {Reveal, Stagger, StaggerItem} from '@/components/motion/Reveal'
import {ButtonLink} from '@/components/ui/Button'
import {SanityImage} from '@/components/ui/SanityImage'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {ServiceIcon} from '@/components/ui/ServiceIcon'
import {CaseStudyCard} from '@/components/work/CaseStudyCard'
import {TOOL_CATEGORIES} from '@/sanity/lib/constants'
import type {CaseStudyCard as CaseStudyCardData, FeedItem, Service, Tool} from '@/sanity/lib/data'
import {hasAsset} from '@/sanity/lib/image'

/** The heading copy for a section, after CMS values and defaults are merged. */
export interface SectionCopy {
  eyebrow?: string | null
  heading: string
  intro?: string | null
}

/* ----------------------------- Featured work ----------------------------- */

export function FeaturedWork({studies, copy}: {studies: CaseStudyCardData[]; copy: SectionCopy}) {
  if (studies.length === 0) return null

  return (
    <section aria-labelledby="featured-work-heading" className="shell section-y">
      <SectionHeading
        id="featured-work-heading"
        {...copy}
        action={
          <ButtonLink href="/work" variant="secondary">
            All case studies <ArrowUpRight aria-hidden className="size-4" />
          </ButtonLink>
        }
      />
      <Stagger className="mt-12 grid gap-x-8 gap-y-14 md:mt-16 md:grid-cols-2">
        {studies.map((study, index) => (
          <StaggerItem key={study._id} className={index === 0 ? 'md:col-span-2' : undefined}>
            <CaseStudyCard
              study={study}
              index={index}
              variant={index === 0 ? 'feature' : 'default'}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

/* --------------------------------- Feed ---------------------------------- */

export function FeedSection({items, copy}: {items: FeedItem[]; copy: SectionCopy}) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="feed-heading" className="bg-paper-2">
      <div className="shell section-y">
        <SectionHeading id="feed-heading" {...copy} />
        <Reveal className="mt-10 md:mt-14">
          <FeedGrid items={items} />
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------- Services -------------------------------- */

export function ServicesSection({services, copy}: {services: Service[]; copy: SectionCopy}) {
  if (services.length === 0) return null

  return (
    <section aria-labelledby="services-heading" className="shell section-y">
      <SectionHeading id="services-heading" {...copy} />
      <Stagger as="ul" className="mt-12 border-t border-line md:mt-16">
        {services.map((service, index) => (
          <StaggerItem
            as="li"
            key={service._id}
            className="group grid gap-x-8 gap-y-5 border-b border-line py-9 md:grid-cols-12 md:py-11"
          >
            <div className="flex items-start gap-5 md:col-span-5">
              <span aria-hidden className="text-label tabular mt-2.5 text-ink-3">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-on-accent">
                  <ServiceIcon name={service.icon} className="size-5" />
                </span>
                <h3 className="text-display-sm">{service.title}</h3>
                {service.startingPrice && (
                  <p className="text-label mt-3 text-ink-3">
                    Starting at <span className="text-ink">{service.startingPrice}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="text-lead text-ink-2">{service.description}</p>
              {service.deliverables && service.deliverables.length > 0 && (
                <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {service.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-start gap-2.5 text-[0.9375rem]">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent-ink" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

/* --------------------------------- Tools --------------------------------- */

export function ToolsSection({
  tools,
  copy,
  headingLevel = 'h2',
}: {
  tools: Tool[]
  copy: SectionCopy
  headingLevel?: 'h2'
}) {
  if (tools.length === 0) return null

  const groups = TOOL_CATEGORIES.map((category) => ({
    ...category,
    tools: tools.filter((tool) => tool.category === category.value),
  })).filter((group) => group.tools.length > 0)

  return (
    <section aria-labelledby="tools-heading" className="shell section-y">
      <SectionHeading id="tools-heading" as={headingLevel} {...copy} />
      <Stagger as="div" className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-5">
        {groups.map((group) => (
          <StaggerItem key={group.value}>
            <h3 className="text-label border-b border-line pb-3 text-ink-3">{group.title}</h3>
            <ul className="mt-4 space-y-3">
              {group.tools.map((tool) => (
                <li key={tool._id} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-card">
                    {hasAsset(tool.logo) ? (
                      <SanityImage
                        image={tool.logo}
                        alt=""
                        aspectRatio={1}
                        maxWidth={72}
                        sizes="36px"
                        className="size-full object-contain p-1.5"
                      />
                    ) : (
                      <span aria-hidden className="font-display text-lg leading-none text-ink-2">
                        {tool.name.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="font-medium">{tool.name}</span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

/* ------------------------------ Contact CTA ------------------------------ */

export function ContactCta({copy, email}: {copy: SectionCopy; email?: string | null}) {
  return (
    <section aria-labelledby="contact-cta-heading" className="shell pb-(--section-y) pt-4">
      <Reveal className="on-accent relative overflow-hidden rounded-xl bg-accent px-6 py-16 text-on-accent sm:px-12 md:py-24">
        {copy.eyebrow && <p className="text-label mb-6 opacity-80">{copy.eyebrow}</p>}
        <h2 id="contact-cta-heading" className="text-display-lg max-w-4xl">
          {copy.heading}
        </h2>
        {copy.intro && <p className="text-lead mt-6 max-w-xl opacity-90">{copy.intro}</p>}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href="/contact" size="lg" variant="inverse">
            Start a project <ArrowUpRight aria-hidden className="size-[1.125rem]" />
          </ButtonLink>
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex min-h-11 items-center font-medium underline decoration-current/40 underline-offset-8 hover:decoration-current"
            >
              {email}
            </a>
          )}
        </div>
      </Reveal>
    </section>
  )
}
