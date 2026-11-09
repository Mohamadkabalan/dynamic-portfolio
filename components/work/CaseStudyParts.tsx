import {ArrowLeft, ArrowRight, ArrowUpRight, TrendingDown, TrendingUp} from 'lucide-react'
import Link from 'next/link'

import {CountUp} from '@/components/motion/CountUp'
import {Stagger, StaggerItem} from '@/components/motion/Reveal'
import {PlatformIcon} from '@/components/ui/PlatformIcon'
import {SanityImage} from '@/components/ui/SanityImage'
import {StoryAvatar} from '@/components/ui/StoryAvatar'
import {cn} from '@/lib/utils'
import {PLATFORM_TITLES} from '@/sanity/lib/constants'
import type {CaseStudy} from '@/sanity/lib/data'
import {croppedAspectRatio, hasAsset} from '@/sanity/lib/image'

/* ------------------------------ At a glance ------------------------------ */

export function AtAGlance({study}: {study: CaseStudy}) {
  const platforms = study.platforms ?? []
  const rows: Array<{label: string; value: React.ReactNode}> = []

  if (study.client?.name) {
    rows.push({
      label: 'Client',
      value: study.client.website ? (
        <a
          href={study.client.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-line-strong underline-offset-4 hover:decoration-accent"
        >
          {study.client.name}
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        study.client.name
      ),
    })
  }
  if (study.industry) rows.push({label: 'Industry', value: study.industry})
  if (platforms.length > 0) {
    rows.push({
      label: 'Platforms',
      value: (
        <ul className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <li
              key={platform}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-sm"
            >
              <PlatformIcon platform={platform} className="size-4" />
              {PLATFORM_TITLES[platform]}
            </li>
          ))}
        </ul>
      ),
    })
  }
  if (study.timeframe) rows.push({label: 'Timeframe', value: study.timeframe})

  if (rows.length === 0) return null

  return (
    <aside aria-label="At a glance" className="rounded-xl border border-line bg-card p-6 sm:p-7">
      <h2 className="text-label mb-5 text-ink-3">At a glance</h2>
      <dl className="divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="py-4 first:pt-0 last:pb-0">
            <dt className="text-label mb-2 text-ink-3">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

/* ------------------------------ Metric cards ----------------------------- */

type Result = NonNullable<CaseStudy['results']>[number]

function MetricCard({result}: {result: Result}) {
  const change = result.change
  const hasChange = typeof change === 'number' && change !== 0
  const isUp = hasChange && change > 0

  return (
    <StaggerItem className="flex h-full flex-col rounded-xl border border-on-inverse/15 bg-on-inverse/5 p-6 sm:p-7">
      <dt className="text-label order-2 mt-4 text-on-inverse-2">{result.label}</dt>
      <dd className="order-1">
        <CountUp
          value={result.value}
          prefix={result.prefix}
          suffix={result.suffix}
          className="font-display text-[clamp(2.75rem,2rem+3.4vw,4.5rem)] leading-none tracking-tight"
        />
      </dd>
      {(hasChange || result.timeframe) && (
        <dd className="order-3 mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-6 text-sm text-on-inverse-2">
          {hasChange && (
            <span
              className={cn(
                'tabular inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold',
                'bg-accent text-on-accent',
              )}
            >
              {isUp ? (
                <TrendingUp aria-hidden className="size-4" />
              ) : (
                <TrendingDown aria-hidden className="size-4" />
              )}
              <span className="sr-only">{isUp ? 'Up' : 'Down'} </span>
              {Math.abs(change).toLocaleString('en')}%
            </span>
          )}
          {result.timeframe}
        </dd>
      )}
    </StaggerItem>
  )
}

export function ResultsBand({results}: {results: CaseStudy['results']}) {
  if (!results || results.length === 0) return null

  return (
    <section aria-labelledby="results-heading" className="on-inverse bg-inverse text-on-inverse">
      <div className="shell py-16 md:py-24">
        <p className="text-label mb-5 flex items-center gap-3 text-on-inverse-2">
          <span aria-hidden className="h-px w-8 bg-accent" />
          The results
        </p>
        <h2 id="results-heading" className="text-display-lg max-w-3xl">
          What changed.
        </h2>
        <Stagger as="dl" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <MetricCard key={result._key} result={result} />
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* -------------------------------- Gallery -------------------------------- */

export function Gallery({images}: {images: CaseStudy['gallery']}) {
  const items = (images ?? []).filter((image) => hasAsset(image))
  if (items.length === 0) return null

  return (
    <section aria-labelledby="gallery-heading" className="shell section-y">
      <h2 id="gallery-heading" className="text-display-md mb-10">
        Gallery
      </h2>
      <Stagger as="ul" className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((image) => (
          <StaggerItem as="li" key={image._key} className="mb-4 break-inside-avoid">
            <figure>
              <SanityImage
                image={image}
                // Very tall or very wide images are gently normalised.
                aspectRatio={Math.min(Math.max(croppedAspectRatio(image), 0.6), 1.9)}
                maxWidth={1200}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full rounded-lg bg-paper-2"
              />
              {image.caption && (
                <figcaption className="mt-2 text-sm text-ink-3">{image.caption}</figcaption>
              )}
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

/* ------------------------------ Testimonial ------------------------------ */

export function CaseStudyTestimonial({testimonial}: {testimonial: CaseStudy['testimonial']}) {
  if (!testimonial?.quote) return null

  return (
    <section aria-label="Client testimonial" className="border-y border-line bg-paper-2">
      <figure className="shell py-16 md:py-24">
        <blockquote className="text-display-md max-w-4xl">
          <span aria-hidden className="text-accent-display">
            &ldquo;
          </span>
          {testimonial.quote}
          <span aria-hidden className="text-accent-display">
            &rdquo;
          </span>
        </blockquote>
        <figcaption className="mt-9 flex items-center gap-4">
          <StoryAvatar image={testimonial.avatar} name={testimonial.name} size={60} />
          <span>
            <span className="block font-semibold">{testimonial.name}</span>
            <span className="text-sm text-ink-2">
              {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
            </span>
          </span>
        </figcaption>
      </figure>
    </section>
  )
}

/* ---------------------------------- Pager -------------------------------- */

type PagerLink = NonNullable<CaseStudy['next']>

function PagerCard({study, direction}: {study: PagerLink; direction: 'previous' | 'next'}) {
  const isNext = direction === 'next'
  return (
    <Link
      href={`/work/${study.slug}`}
      className={cn(
        'group flex items-center gap-5 rounded-xl border border-line p-4 transition-colors duration-300 hover:border-ink sm:p-5',
        isNext && 'flex-row-reverse text-right',
      )}
    >
      <span className="relative hidden aspect-4/3 w-28 shrink-0 overflow-hidden rounded-md bg-paper-2 sm:block">
        <SanityImage
          image={study.cover}
          alt=""
          aspectRatio={4 / 3}
          maxWidth={320}
          sizes="112px"
          fill
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn('text-label flex items-center gap-2 text-ink-3', isNext && 'justify-end')}
        >
          {!isNext && (
            <ArrowLeft
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-x-1"
            />
          )}
          {isNext ? 'Next case study' : 'Previous case study'}
          {isNext && (
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
            />
          )}
        </span>
        <span className="text-display-sm mt-2 line-clamp-2 block">{study.title}</span>
      </span>
    </Link>
  )
}

export function CaseStudyPager({
  previous,
  next,
}: {
  previous: CaseStudy['previous']
  next: CaseStudy['next']
}) {
  if (!previous && !next) return null

  return (
    <nav aria-label="More case studies" className="shell py-14 md:py-20">
      <div className="grid gap-4 md:grid-cols-2">
        {previous ? <PagerCard study={previous} direction="previous" /> : <span className="hidden md:block" />}
        {next && <PagerCard study={next} direction="next" />}
      </div>
    </nav>
  )
}
