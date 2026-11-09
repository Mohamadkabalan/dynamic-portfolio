'use client'

import {ChevronLeft, ChevronRight} from 'lucide-react'
import {useCallback, useEffect, useRef, useState} from 'react'

import {SanityImage} from '@/components/ui/SanityImage'
import {cn} from '@/lib/utils'
import type {CmsImage} from '@/sanity/lib/image'

interface Slide extends CmsImage {
  _key: string
}

interface CarouselViewerProps {
  slides: Slide[]
  label: string
  /** Width ÷ height of each slide. */
  aspectRatio?: number
  sizes: string
  className?: string
}

/**
 * A swipeable image carousel, the way carousels work on Instagram: swipe on
 * touch, drag the scroll, use the arrow buttons, or the arrow keys when the
 * strip has keyboard focus. Built on native scroll-snap, so it stays smooth.
 */
export function CarouselViewer({
  slides,
  label,
  aspectRatio = 4 / 5,
  sizes,
  className,
}: CarouselViewerProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const goTo = useCallback((next: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(next, track.children.length - 1))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({left: clamped * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth'})
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      if (track.clientWidth > 0) setIndex(Math.round(track.scrollLeft / track.clientWidth))
    }
    track.addEventListener('scroll', onScroll, {passive: true})
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  if (slides.length === 0) return null
  const hasMany = slides.length > 1

  return (
    <div
      data-carousel
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('relative', className)}
    >
      <div
        ref={trackRef}
        tabIndex={hasMany ? 0 : -1}
        aria-label={hasMany ? `${label}. Use the left and right arrow keys to change slide.` : undefined}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            goTo(index + 1)
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            goTo(index - 1)
          }
        }}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-md"
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide._key}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${slides.length}`}
            className="relative w-full shrink-0 snap-center bg-paper-2"
            style={{aspectRatio}}
          >
            <SanityImage
              image={slide}
              aspectRatio={aspectRatio}
              maxWidth={1200}
              sizes={sizes}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#151311] shadow-soft transition-opacity disabled:opacity-0"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === slides.length - 1}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#151311] shadow-soft transition-opacity disabled:opacity-0"
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
          <div aria-hidden className="mt-3 flex justify-center gap-1.5">
            {slides.map((slide, slideIndex) => (
              <span
                key={slide._key}
                className={cn(
                  'size-1.5 rounded-full transition-colors duration-300',
                  slideIndex === index ? 'bg-accent' : 'bg-line-strong',
                )}
              />
            ))}
          </div>
          <p aria-live="polite" className="sr-only">
            Slide {index + 1} of {slides.length}
          </p>
        </>
      )}
    </div>
  )
}
