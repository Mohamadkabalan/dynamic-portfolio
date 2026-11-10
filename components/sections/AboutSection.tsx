import {ArrowUpRight, Download} from 'lucide-react'

import {Reveal, Stagger, StaggerItem} from '@/components/motion/Reveal'
import {LanguagesSection} from '@/components/sections/Languages'
import {Availability} from '@/components/shell/Availability'
import {SocialLinks} from '@/components/shell/SocialLinks'
import {ButtonLink} from '@/components/ui/Button'
import {RichText} from '@/components/ui/RichText'
import {SanityImage} from '@/components/ui/SanityImage'
import {Eyebrow} from '@/components/ui/SectionHeading'
import {siteName} from '@/lib/site'
import type {AboutData, SiteSettings} from '@/sanity/lib/data'
import {hasAsset} from '@/sanity/lib/image'

interface AboutSectionProps {
  about: AboutData
  settings: SiteSettings | null
}

/**
 * The "About" part of the one-page site: intro with portrait, approach,
 * experience, languages, values and certifications. The "About" link in the
 * menu lands on the intro; the wrapper keeps the link highlighted throughout.
 */
export function AboutSection({about, settings}: AboutSectionProps) {
  const page = about.page
  if (!page) return null

  const name = siteName(settings)
  const approach = page.approach ?? []
  const experience = page.experience ?? []
  const values = page.values ?? []
  const certifications = about.certifications

  return (
    <div id="about">
      {/* Intro */}
      <section aria-labelledby="about-heading" className="shell section-y">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <Eyebrow className="mb-6">About</Eyebrow>
            <h2 id="about-heading" className="text-display-lg">
              {page.headline?.trim() || `Hi, I'm ${name}.`}
            </h2>
            <RichText value={page.bio} className="mt-9 max-w-prose-editorial" />

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/#contact" size="lg">
                Work with me <ArrowUpRight aria-hidden className="size-[1.125rem]" />
              </ButtonLink>
              {settings?.resumeUrl && (
                <ButtonLink
                  href={`${settings.resumeUrl}?dl=`}
                  size="lg"
                  variant="secondary"
                  download
                >
                  <Download aria-hidden className="size-[1.125rem]" /> Download CV
                </ButtonLink>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            {hasAsset(page.portrait) && (
              <div className="relative mx-auto max-w-md lg:ml-auto lg:mr-0">
                <span
                  aria-hidden
                  className="absolute -bottom-4 -right-4 size-full rounded-t-full rounded-b-xl bg-accent"
                />
                <div className="relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-xl bg-paper-2">
                  <SanityImage
                    image={page.portrait}
                    aspectRatio={4 / 5}
                    maxWidth={1100}
                    sizes="(min-width: 1024px) 440px, 90vw"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className="mx-auto mt-10 max-w-md space-y-5 lg:ml-auto lg:mr-0">
              <Availability
                isAvailable={settings?.availability?.isAvailable}
                text={settings?.availability?.text}
              />
              {settings?.location && <p className="text-sm text-ink-2">{settings.location}</p>}
              <SocialLinks links={settings?.socialLinks} variant="list" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Approach */}
      {approach.length > 0 && (
        <section aria-labelledby="approach-heading" className="bg-paper-2">
          <div className="shell section-y">
            <Reveal>
              <Eyebrow className="mb-5">Approach</Eyebrow>
              <h2 id="approach-heading" className="text-display-lg max-w-3xl">
                {page.approachHeading?.trim() || 'How I work'}
              </h2>
            </Reveal>
            <Stagger as="ol" className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
              {approach.map((step, index) => (
                <StaggerItem as="li" key={step._key} className="border-t border-line-strong pt-6">
                  <span aria-hidden className="font-display text-5xl leading-none text-accent-display">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-display-sm mt-5">{step.title}</h3>
                  {step.description && <p className="mt-3 text-ink-2">{step.description}</p>}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section aria-labelledby="experience-heading" className="shell section-y">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow className="mb-5">Timeline</Eyebrow>
              <h2 id="experience-heading" className="text-display-lg">
                {page.experienceHeading?.trim() || 'Experience'}
              </h2>
            </Reveal>
            <Stagger as="ol" className="border-t border-line lg:col-span-8">
              {experience.map((role) => (
                <StaggerItem
                  as="li"
                  key={role._key}
                  className="grid gap-x-8 gap-y-2 border-b border-line py-7 sm:grid-cols-[9rem_minmax(0,1fr)]"
                >
                  <p className="text-label pt-1.5 text-ink-3">{role.period}</p>
                  <div>
                    <h3 className="text-display-sm">{role.role}</h3>
                    {role.company && <p className="mt-1 font-medium text-accent-ink">{role.company}</p>}
                    {role.description && <p className="mt-3 text-ink-2">{role.description}</p>}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Languages */}
      <LanguagesSection languages={page.languages ?? []} heading={page.languagesHeading} />

      {/* Values */}
      {values.length > 0 && (
        <section aria-labelledby="values-heading" className="on-inverse bg-inverse text-on-inverse">
          <div className="shell section-y">
            <Reveal>
              <p className="text-label mb-5 flex items-center gap-3 text-on-inverse-2">
                <span aria-hidden className="h-px w-8 bg-accent" />
                Values
              </p>
              <h2 id="values-heading" className="text-display-lg max-w-3xl">
                {page.valuesHeading?.trim() || 'What I believe'}
              </h2>
            </Reveal>
            <Stagger as="ul" className="mt-12 grid gap-x-10 gap-y-10 md:mt-16 md:grid-cols-2">
              {values.map((value) => (
                <StaggerItem as="li" key={value._key} className="border-t border-on-inverse/20 pt-6">
                  <h3 className="text-display-md">{value.title}</h3>
                  {value.description && (
                    <p className="text-lead mt-4 max-w-xl text-on-inverse-2">{value.description}</p>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section aria-labelledby="certifications-heading" className="shell section-y">
          <Reveal>
            <Eyebrow className="mb-5">Credentials</Eyebrow>
            <h2 id="certifications-heading" className="text-display-lg">
              Certifications
            </h2>
          </Reveal>
          <Stagger as="ul" className="mt-12 grid gap-4 md:grid-cols-2">
            {certifications.map((certification) => {
              const body = (
                <>
                  <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-paper-2">
                    {hasAsset(certification.badge) ? (
                      <SanityImage
                        image={certification.badge}
                        aspectRatio={1}
                        maxWidth={128}
                        sizes="64px"
                        className="size-full object-contain p-1.5"
                      />
                    ) : (
                      <span aria-hidden className="font-display text-2xl text-ink-2">
                        {certification.issuer.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-display-sm block">{certification.title}</span>
                    <span className="text-label mt-2 block text-ink-3">
                      {[certification.issuer, certification.year].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </>
              )
              return (
                <StaggerItem as="li" key={certification._id}>
                  {certification.credentialUrl ? (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full items-center gap-5 rounded-xl border border-line bg-card p-5 transition-colors duration-300 hover:border-ink"
                    >
                      {body}
                      <ArrowUpRight
                        aria-hidden
                        className="size-5 shrink-0 text-ink-3 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                      />
                      <span className="sr-only"> View credential (opens in a new tab)</span>
                    </a>
                  ) : (
                    <div className="flex h-full items-center gap-5 rounded-xl border border-line bg-card p-5">
                      {body}
                    </div>
                  )}
                </StaggerItem>
              )
            })}
          </Stagger>
        </section>
      )}
    </div>
  )
}
