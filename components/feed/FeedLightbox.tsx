'use client'

import {
  ArrowUpRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Send,
  X,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import {useEffect, useRef} from 'react'

import {CarouselViewer} from '@/components/feed/CarouselViewer'
import {FEED_TYPE_LABELS, feedCover} from '@/components/feed/FeedTile'
import {EmbedPlayer} from '@/components/ui/EmbedPlayer'
import {PhoneFrame} from '@/components/ui/PhoneFrame'
import {PlatformIcon} from '@/components/ui/PlatformIcon'
import {SanityImage} from '@/components/ui/SanityImage'
import {formatCompact} from '@/lib/utils'
import {PLATFORM_TITLES} from '@/sanity/lib/constants'
import type {FeedItem} from '@/sanity/lib/data'
import {hasAsset, staticImageUrl} from '@/sanity/lib/image'

const METRICS: Array<{key: keyof NonNullable<FeedItem['metrics']>; label: string; icon: LucideIcon}> = [
  {key: 'views', label: 'Views', icon: Eye},
  {key: 'likes', label: 'Likes', icon: Heart},
  {key: 'comments', label: 'Comments', icon: MessageCircle},
  {key: 'shares', label: 'Shares', icon: Send},
  {key: 'saves', label: 'Saves', icon: Bookmark},
]

const MEDIA_SIZES = '(min-width: 1024px) 440px, 90vw'

interface FeedLightboxProps {
  items: FeedItem[]
  /** Index of the open item, or null when closed. */
  index: number | null
  onChange: (index: number | null) => void
}

function LightboxMedia({item}: {item: FeedItem}) {
  const isVertical = item.type === 'reel' || item.type === 'story'
  const cover = feedCover(item)
  const slides = (item.images ?? []).filter((image) => hasAsset(image))
  const label = `${FEED_TYPE_LABELS[item.type] ?? 'Post'}: ${item.title}`

  if (isVertical && item.videoUrl) {
    return (
      <PhoneFrame className="mx-auto w-full max-w-[19rem]" notch={false}>
        <video
          key={item._id}
          src={item.videoUrl}
          poster={cover ? staticImageUrl(cover, {width: 720, height: 1280, format: 'jpg'}) : undefined}
          controls
          playsInline
          preload="metadata"
          aria-label={label}
          className="absolute inset-0 size-full bg-black object-cover"
        />
      </PhoneFrame>
    )
  }

  if (item.embedUrl && (isVertical || slides.length === 0)) {
    return <EmbedPlayer url={item.embedUrl} title={label} className="mx-auto max-w-[22rem]" />
  }

  if (isVertical && cover) {
    return (
      <PhoneFrame className="mx-auto w-full max-w-[19rem]">
        <SanityImage
          image={cover}
          aspectRatio={9 / 16}
          maxWidth={900}
          sizes={MEDIA_SIZES}
          fill
          className="object-cover"
        />
      </PhoneFrame>
    )
  }

  return (
    <CarouselViewer
      key={item._id}
      slides={slides}
      label={label}
      sizes={MEDIA_SIZES}
      className="mx-auto w-full max-w-[27.5rem]"
    />
  )
}

/**
 * The pop-up that opens when a feed item is clicked: the media, the caption as
 * it was posted, and how it performed.
 *
 * It uses the native <dialog> element, which traps keyboard focus, closes on
 * Escape and returns focus to the tile that opened it. Left/right arrow keys
 * move between items.
 */
export function FeedLightbox({items, index, onChange}: FeedLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const item = index === null ? null : items[index]
  const isOpen = Boolean(item)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const step = (direction: 1 | -1) => {
    if (index === null || items.length < 2) return
    onChange((index + direction + items.length) % items.length)
  }

  const metrics = item
    ? METRICS.filter(({key}) => typeof item.metrics?.[key] === 'number')
    : []

  return (
    <dialog
      ref={dialogRef}
      aria-label={item ? `${FEED_TYPE_LABELS[item.type] ?? 'Post'}: ${item.title}` : 'Feed item'}
      onClose={() => onChange(null)}
      onClick={(event) => {
        // A click on the dimmed area around the panel closes the dialog.
        if (event.target === event.currentTarget) onChange(null)
      }}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest('[data-carousel], video, iframe')) return
        if (event.key === 'ArrowRight') step(1)
        if (event.key === 'ArrowLeft') step(-1)
      }}
      className="m-auto max-h-[100dvh] w-full max-w-5xl bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm open:animate-page-in sm:max-h-[92dvh] sm:p-4"
    >
      {item && (
        <div className="relative grid max-h-[100dvh] overflow-y-auto bg-card text-ink sm:max-h-[calc(92dvh-2rem)] sm:rounded-xl lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex items-center bg-paper-2 px-5 pb-6 pt-16 sm:p-8 lg:pt-8">
            <LightboxMedia item={item} />
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <p className="text-label flex items-center gap-2 pr-12 text-ink-3">
              <PlatformIcon platform={item.platform} className="size-4" />
              {PLATFORM_TITLES[item.platform]}
              <span aria-hidden>·</span>
              {FEED_TYPE_LABELS[item.type] ?? 'Post'}
            </p>

            {item.caption ? (
              <p className="mt-5 whitespace-pre-line text-[1.0625rem] leading-relaxed">
                {item.caption}
              </p>
            ) : (
              <p className="text-display-sm mt-5">{item.title}</p>
            )}

            {metrics.length > 0 && (
              <dl className="mt-7 grid grid-cols-3 gap-x-4 gap-y-5 border-t border-line pt-6">
                {metrics.map(({key, label, icon: Icon}) => (
                  <div key={key} className="flex flex-col-reverse">
                    <dt className="text-label mt-1.5 flex items-center gap-1.5 text-ink-3">
                      <Icon aria-hidden className="size-3.5" />
                      {label}
                    </dt>
                    <dd className="tabular font-display text-[1.75rem] leading-none">
                      {formatCompact(item.metrics?.[key] ?? 0)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-8">
              {item.originalUrl && (
                <a
                  href={item.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium underline decoration-line-strong underline-offset-4 hover:decoration-accent"
                >
                  View original
                  <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {item.caseStudy?.slug && (
                <Link
                  href={`/work/${item.caseStudy.slug}`}
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium underline decoration-line-strong underline-offset-4 hover:decoration-accent"
                >
                  Read the case study
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              )}
            </div>

            {items.length > 1 && (
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="inline-flex min-h-11 items-center gap-1 rounded-full pr-3 text-sm text-ink-2 transition-colors hover:text-ink"
                >
                  <ChevronLeft aria-hidden className="size-5" /> Previous
                </button>
                <p className="text-label tabular text-ink-3" aria-live="polite">
                  {(index ?? 0) + 1} / {items.length}
                </p>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="inline-flex min-h-11 items-center gap-1 rounded-full pl-3 text-sm text-ink-2 transition-colors hover:text-ink"
                >
                  Next <ChevronRight aria-hidden className="size-5" />
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Close"
            autoFocus
            className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-card text-ink shadow-soft transition-colors hover:bg-ink hover:text-paper"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
      )}
    </dialog>
  )
}
