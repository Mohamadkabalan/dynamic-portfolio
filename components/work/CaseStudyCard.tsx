import {ArrowUpRight} from 'lucide-react'
import Link from 'next/link'

import {PlatformIcon} from '@/components/ui/PlatformIcon'
import {SanityImage} from '@/components/ui/SanityImage'
import {cn} from '@/lib/utils'
import {PLATFORM_TITLES} from '@/sanity/lib/constants'
import type {CaseStudyCard as CaseStudyCardData} from '@/sanity/lib/data'

interface CaseStudyCardProps {
  study: CaseStudyCardData
  /** `feature` is the wide, magazine-cover treatment used for the first card. */
  variant?: 'default' | 'feature'
  /** Shown as a large index number, e.g. "01". */
  index?: number
  headingLevel?: 'h2' | 'h3'
  /** Load the cover immediately (first card on the work page). */
  preload?: boolean
  className?: string
}

export function CaseStudyCard({
  study,
  variant = 'default',
  index,
  headingLevel: Heading = 'h3',
  preload = false,
  className,
}: CaseStudyCardProps) {
  const isFeature = variant === 'feature'
  const meta = [study.clientName, study.industry].filter(Boolean).join(' · ')
  const platforms = study.platforms ?? []

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-lg bg-paper-2',
          isFeature ? 'aspect-4/3 md:aspect-16/9' : 'aspect-4/3',
        )}
      >
        <SanityImage
          image={study.cover}
          aspectRatio={isFeature ? 16 / 9 : 4 / 3}
          maxWidth={isFeature ? 2000 : 1400}
          sizes={
            isFeature
              ? '(min-width: 1280px) 1184px, 100vw'
              : '(min-width: 1280px) 580px, (min-width: 768px) 50vw, 100vw'
          }
          preload={preload}
          fill
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.035]"
        />

        {platforms.length > 0 && (
          <ul
            aria-label="Platforms"
            className="absolute left-3 top-3 flex gap-1 rounded-full bg-black/55 px-2.5 py-1.5 text-white backdrop-blur-sm"
          >
            {platforms.map((platform) => (
              <li key={platform} className="flex">
                <PlatformIcon platform={platform} className="size-4" />
                <span className="sr-only">{PLATFORM_TITLES[platform]}</span>
              </li>
            ))}
          </ul>
        )}

        {typeof index === 'number' && (
          <span
            aria-hidden
            className="text-label absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1.5 text-white backdrop-blur-sm"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-5">
        <div className="min-w-0">
          {meta && <p className="text-label text-ink-3">{meta}</p>}
          <Heading className={cn('mt-2', isFeature ? 'text-display-md' : 'text-display-sm')}>
            <Link
              href={`/work/${study.slug}`}
              className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-(--focus)"
            >
              {study.title}
            </Link>
          </Heading>
          {study.summary && (
            <p className={cn('mt-3 line-clamp-2 text-ink-2', isFeature && 'max-w-2xl')}>
              {study.summary}
            </p>
          )}
        </div>
        <span
          aria-hidden
          className="mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong transition-[background-color,color,border-color,transform] duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>

      {study.topResults && study.topResults.length > 0 && (
        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-4">
          {study.topResults.map((result) => (
            <div key={result._key} className="flex flex-col-reverse">
              <dt className="text-label mt-1 text-ink-3">{result.label}</dt>
              <dd className="tabular font-display text-2xl leading-none">
                {result.prefix}
                {result.value.toLocaleString('en')}
                {result.suffix}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}
