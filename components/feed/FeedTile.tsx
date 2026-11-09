'use client'

import {Eye, Heart, Layers, Play} from 'lucide-react'
import {useRef, useState} from 'react'

import {PhoneFrame} from '@/components/ui/PhoneFrame'
import {PlatformIcon} from '@/components/ui/PlatformIcon'
import {SanityImage} from '@/components/ui/SanityImage'
import {cn, formatCompact} from '@/lib/utils'
import {PLATFORM_TITLES} from '@/sanity/lib/constants'
import type {FeedItem} from '@/sanity/lib/data'
import {hasAsset} from '@/sanity/lib/image'

export const FEED_TYPE_LABELS: Record<string, string> = {
  post: 'Post',
  carousel: 'Carousel',
  reel: 'Reel',
  story: 'Story',
}

/** The image used as the tile's cover: the custom cover if set, else the first image. */
export function feedCover(item: FeedItem) {
  if (hasAsset(item.poster)) return item.poster
  return item.images?.find((image) => hasAsset(image)) ?? null
}

interface FeedTileProps {
  item: FeedItem
  onOpen: () => void
  sizes: string
}

/**
 * One item in the feed grid. Posts and carousels sit in a 4:5 frame (a
 * carousel swipes to its second slide on hover); reels and stories sit in a
 * phone frame and play on hover or keyboard focus.
 */
export function FeedTile({item, onOpen, sizes}: FeedTileProps) {
  const [active, setActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const cover = feedCover(item)
  const isVertical = item.type === 'reel' || item.type === 'story'
  const isCarousel = item.type === 'carousel'
  const secondSlide = isCarousel ? item.images?.filter((image) => hasAsset(image))[1] : null
  const slideCount = item.images?.length ?? 0
  const platformName = PLATFORM_TITLES[item.platform] ?? item.platform
  const typeLabel = FEED_TYPE_LABELS[item.type] ?? 'Post'
  const headlineMetric = item.metrics?.views ?? item.metrics?.likes

  const activate = () => {
    // Hover previews are for devices with a real pointer; touch opens the lightbox.
    if (window.matchMedia('(hover: hover)').matches) setActive(true)
  }
  const deactivate = () => {
    setActive(false)
    videoRef.current?.pause()
  }

  const overlay = (
    <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-linear-to-t from-black/70 to-transparent p-3 pt-10 text-white">
      <span className="flex items-center gap-1.5 text-[0.8125rem] font-medium">
        <PlatformIcon platform={item.platform} className="size-4" />
        {typeLabel}
      </span>
      {typeof headlineMetric === 'number' && (
        <span className="tabular flex items-center gap-1 text-[0.8125rem] font-medium">
          {typeof item.metrics?.views === 'number' ? (
            <Eye aria-hidden className="size-4" />
          ) : (
            <Heart aria-hidden className="size-4" />
          )}
          {formatCompact(headlineMetric)}
        </span>
      )}
    </span>
  )

  const media = (
    <>
      {cover && (
        <SanityImage
          image={cover}
          alt=""
          aspectRatio={isVertical ? 9 / 16 : 4 / 5}
          maxWidth={720}
          sizes={sizes}
          fill
          className="object-cover"
        />
      )}

      {/* Carousel: the second slide swipes in on hover. */}
      {secondSlide && active && (
        <span className="absolute inset-0 animate-swipe-in">
          <SanityImage
            image={secondSlide}
            alt=""
            aspectRatio={4 / 5}
            maxWidth={720}
            sizes={sizes}
            fill
            className="object-cover"
          />
        </span>
      )}

      {/* Reel / story: the clip plays on hover or focus. */}
      {isVertical && item.videoUrl && active && (
        <video
          ref={videoRef}
          src={item.videoUrl}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {item.type === 'story' && (
        <span aria-hidden className="absolute inset-x-3 top-7 flex gap-1">
          <span className="h-0.5 flex-1 rounded-full bg-white" />
          <span className="h-0.5 flex-1 rounded-full bg-white/40" />
          <span className="h-0.5 flex-1 rounded-full bg-white/40" />
        </span>
      )}

      {isCarousel && (
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Layers aria-hidden className="size-3.5" />
          <span aria-hidden>{slideCount}</span>
        </span>
      )}

      {isVertical && !active && (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-transform duration-300 ease-out-expo group-hover:scale-110"
        >
          <Play className="ml-0.5 size-5 fill-current" />
        </span>
      )}

      {overlay}
    </>
  )

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={activate}
      onPointerLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      aria-haspopup="dialog"
      aria-label={`Open ${typeLabel.toLowerCase()} on ${platformName}: ${item.title}`}
      className={cn(
        'group relative block w-full text-left transition-transform duration-500 ease-out-expo hover:-translate-y-1',
        !isVertical && 'aspect-4/5 overflow-hidden rounded-md bg-paper-2',
      )}
    >
      {isVertical ? <PhoneFrame compact>{media}</PhoneFrame> : media}
    </button>
  )
}
