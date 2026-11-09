import {ArrowLeft} from 'lucide-react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {FeedGrid} from '@/components/feed/FeedGrid'
import {Reveal} from '@/components/motion/Reveal'
import {ContactCta} from '@/components/sections/HomeSections'
import {RichText} from '@/components/ui/RichText'
import {SanityImage} from '@/components/ui/SanityImage'
import {Eyebrow} from '@/components/ui/SectionHeading'
import {
  AtAGlance,
  CaseStudyPager,
  CaseStudyTestimonial,
  Gallery,
  ResultsBand,
} from '@/components/work/CaseStudyParts'
import {JsonLd, caseStudyJsonLd} from '@/lib/jsonld'
import {pageMetadata} from '@/lib/metadata'
import {
  getCaseStudy,
  getCaseStudyMeta,
  getCaseStudySlugs,
  getSiteSettings,
} from '@/sanity/lib/data'
import {hasAsset, staticImageUrl} from '@/sanity/lib/image'

/**
 * Case studies that exist at build time are prerendered. `dynamicParams = true`
 * means a case study published later is rendered on its first visit and then
 * cached — no redeploy needed. A slug that does not exist (or was deleted)
 * returns the 404 page.
 */
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs()
  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const {slug} = await params
  const [study, settings] = await Promise.all([getCaseStudyMeta(slug), getSiteSettings()])
  if (!study) return {title: 'Case study not found', robots: {index: false}}

  return pageMetadata({
    settings,
    seo: study.seo,
    title: study.title,
    description: study.summary,
    path: `/work/${slug}`,
    generatedImage: `/og/work/${slug}`,
    type: 'article',
  })
}

const STORY_SECTIONS = [
  {key: 'challenge', label: 'The challenge'},
  {key: 'strategy', label: 'The strategy'},
  {key: 'execution', label: 'The execution'},
] as const

export default async function CaseStudyPage({params}: PageProps<'/work/[slug]'>) {
  const {slug} = await params
  const [study, settings] = await Promise.all([getCaseStudy(slug), getSiteSettings()])
  if (!study) notFound()

  const meta = [study.client?.name, study.industry].filter(Boolean).join(' · ')
  const story = STORY_SECTIONS.filter(({key}) => (study[key]?.length ?? 0) > 0)

  return (
    <article>
      <JsonLd
        data={caseStudyJsonLd(settings, {
          title: study.title,
          description: study.summary,
          path: `/work/${study.slug}`,
          image: hasAsset(study.cover)
            ? staticImageUrl(study.cover, {width: 1200, height: 630, format: 'jpg'})
            : null,
          dateModified: study._updatedAt,
        })}
      />

      <header className="shell pb-10 pt-8 md:pb-14 md:pt-12">
        <Link
          href="/work"
          className="group mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-ink-2 transition-colors hover:text-ink"
        >
          <ArrowLeft
            aria-hidden
            className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-x-1"
          />
          All case studies
        </Link>
        {meta && <Eyebrow className="mb-6">{meta}</Eyebrow>}
        <h1 className="text-display-lg max-w-5xl motion-safe:animate-rise">{study.title}</h1>
        {study.summary && (
          <p className="text-lead mt-7 max-w-3xl text-ink-2 motion-safe:animate-rise motion-safe:[animation-delay:80ms]">
            {study.summary}
          </p>
        )}
      </header>

      {/* Full-bleed cover */}
      {hasAsset(study.cover) && (
        <div className="relative aspect-4/3 w-full overflow-hidden bg-paper-2 sm:aspect-16/9 lg:aspect-21/9">
          <SanityImage
            image={study.cover}
            aspectRatio={16 / 9}
            maxWidth={2400}
            sizes="100vw"
            preload
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="shell grid gap-12 py-(--section-y) lg:grid-cols-12 lg:gap-10">
        <div className="lg:order-2 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <AtAGlance study={study} />
          </div>
        </div>

        <div className="space-y-16 lg:order-1 lg:col-span-8 lg:pr-8">
          {story.map(({key, label}, index) => (
            <Reveal as="section" key={key}>
              <h2 className="mb-6 flex items-baseline gap-4">
                <span aria-hidden className="text-label tabular text-accent-ink">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-display-md">{label}</span>
              </h2>
              <RichText value={study[key]} className="max-w-prose-editorial" />
            </Reveal>
          ))}
          {story.length === 0 && (
            <p className="text-lead text-ink-2">The full write-up for this project is coming soon.</p>
          )}
        </div>
      </div>

      <ResultsBand results={study.results} />
      <Gallery images={study.gallery} />
      <CaseStudyTestimonial testimonial={study.testimonial} />

      {study.relatedContent.length > 0 && (
        <section aria-labelledby="related-content-heading" className="shell section-y">
          <Eyebrow className="mb-5">From this project</Eyebrow>
          <h2 id="related-content-heading" className="text-display-md mb-10">
            Content from the campaign
          </h2>
          <FeedGrid items={study.relatedContent} showFilter={false} />
        </section>
      )}

      <CaseStudyPager previous={study.previous} next={study.next} />

      <ContactCta
        copy={{
          eyebrow: 'Next step',
          heading: 'Your brand could be the next case study.',
          intro: 'Tell me about your goals and I will reply within two working days.',
        }}
        email={settings?.contactEmail}
      />
    </article>
  )
}
