'use client'

import {ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react'
import {useInView, useReducedMotion} from 'motion/react'
import {useCallback, useRef, useState, type KeyboardEvent} from 'react'

import {StoryAvatar} from '@/components/ui/StoryAvatar'
import {cn} from '@/lib/utils'
import type {Testimonial} from '@/sanity/lib/data'

/** Seconds each testimonial stays up before the next one plays. */
const STORY_SECONDS = 8

interface TestimonialStoriesProps {
  testimonials: Testimonial[]
}

/**
 * Testimonials presented like a row of stories: tap an avatar to read that
 * person's quote. On screens it advances by itself with story-style progress
 * bars; it pauses on hover, on keyboard focus, when off screen, and it can be
 * paused with a button. With "reduce motion" on, it never advances by itself.
 *
 * Keyboard: the avatars are a tab list — use the left/right arrow keys.
 */
export function TestimonialStories({testimonials}: TestimonialStoriesProps) {
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState<ReadonlySet<number>>(new Set())
  const [userPaused, setUserPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const inView = useInView(containerRef, {amount: 0.4})
  const reduceMotion = useReducedMotion()

  const count = testimonials.length
  const canAutoPlay = count > 1 && !reduceMotion
  const playing = canAutoPlay && !userPaused && !hovering && inView

  const goTo = useCallback(
    (next: number, focusTab = false) => {
      const target = (next + count) % count
      setSeen((previous) => new Set(previous).add(active))
      setActive(target)
      if (focusTab) tabRefs.current[target]?.focus()
    },
    [active, count],
  )

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(active + 1, true)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(active - 1, true)
    } else if (event.key === 'Home') {
      event.preventDefault()
      goTo(0, true)
    } else if (event.key === 'End') {
      event.preventDefault()
      goTo(count - 1, true)
    }
  }

  if (count === 0) return null
  const current = testimonials[active]

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovering(false)
      }}
    >
      {/* Story ring avatars */}
      <div
        role="tablist"
        aria-label="Testimonials"
        className="no-scrollbar -mx-(--gutter) flex gap-4 overflow-x-auto px-(--gutter) py-2 sm:gap-6"
      >
        {testimonials.map((testimonial, index) => {
          const selected = index === active
          return (
            <button
              key={testimonial._id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`testimonial-tab-${index}`}
              aria-selected={selected}
              aria-controls="testimonial-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => goTo(index)}
              onKeyDown={onTabKeyDown}
              className="group flex w-[4.75rem] shrink-0 flex-col items-center gap-2 rounded-md text-center"
            >
              <StoryAvatar
                image={testimonial.avatar}
                name={testimonial.name}
                size={68}
                seen={seen.has(index) && !selected}
                className={cn(
                  'transition-transform duration-300 ease-out-expo group-hover:scale-105',
                  selected && 'scale-105',
                )}
              />
              <span
                className={cn(
                  'w-full truncate text-xs',
                  selected ? 'font-semibold text-ink' : 'text-ink-3',
                )}
              >
                {testimonial.name.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>

      {/* The open "story" */}
      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-card">
        {count > 1 && (
          <div aria-hidden className="flex gap-1.5 px-6 pt-5 sm:px-10">
            {testimonials.map((testimonial, index) => (
              <span
                key={testimonial._id}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-line-strong"
              >
                <span
                  key={index === active ? `active-${active}` : 'idle'}
                  onAnimationEnd={index === active && canAutoPlay ? () => goTo(active + 1) : undefined}
                  className={cn(
                    'block h-full origin-left rounded-full bg-accent',
                    index < active && 'scale-x-100',
                    index > active && 'scale-x-0',
                    index === active && (canAutoPlay ? 'animate-story' : 'scale-x-100'),
                  )}
                  style={
                    index === active && canAutoPlay
                      ? ({
                          '--story-duration': `${STORY_SECONDS}s`,
                          animationPlayState: playing ? 'running' : 'paused',
                        } as React.CSSProperties)
                      : undefined
                  }
                />
              </span>
            ))}
          </div>
        )}

        <div
          role="tabpanel"
          id="testimonial-panel"
          aria-labelledby={`testimonial-tab-${active}`}
          tabIndex={0}
          className="px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10"
        >
          <figure key={current._id} className="motion-safe:animate-page-in">
            <blockquote className="text-display-md max-w-4xl">
              <span aria-hidden className="text-accent-display">
                &ldquo;
              </span>
              {current.quote}
              <span aria-hidden className="text-accent-display">
                &rdquo;
              </span>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <StoryAvatar image={current.avatar} name={current.name} size={48} seen />
              <span>
                <span className="block font-semibold">{current.name}</span>
                <span className="text-sm text-ink-2">
                  {[current.role, current.company].filter(Boolean).join(' · ')}
                </span>
              </span>
            </figcaption>
          </figure>
        </div>

        {count > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3 sm:px-8">
            <p className="text-label tabular px-2 text-ink-3">
              {active + 1} / {count}
            </p>
            <div className="flex items-center gap-1">
              {canAutoPlay && (
                <button
                  type="button"
                  onClick={() => setUserPaused((paused) => !paused)}
                  aria-label={userPaused ? 'Resume auto-advance' : 'Pause auto-advance'}
                  className="flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-ink/8 hover:text-ink"
                >
                  {userPaused ? (
                    <Play aria-hidden className="size-4" />
                  ) : (
                    <Pause aria-hidden className="size-4" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                aria-label="Previous testimonial"
                className="flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-ink/8 hover:text-ink"
              >
                <ChevronLeft aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                aria-label="Next testimonial"
                className="flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-ink/8 hover:text-ink"
              >
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
