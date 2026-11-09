import {ArrowDownRight, ArrowUpRight} from 'lucide-react'

import {ButtonLink} from '@/components/ui/Button'
import {LoopingVideo} from '@/components/ui/LoopingVideo'
import {PhoneFrame} from '@/components/ui/PhoneFrame'
import {PlatformIcon} from '@/components/ui/PlatformIcon'
import {SanityImage} from '@/components/ui/SanityImage'
import {cn, splitHighlight} from '@/lib/utils'
import {PLATFORM_TITLES} from '@/sanity/lib/constants'
import type {HomeData, SiteSettings} from '@/sanity/lib/data'
import {hasAsset} from '@/sanity/lib/image'

type HeroData = NonNullable<NonNullable<HomeData['page']>['hero']>

interface HeroProps {
  hero: HeroData
  settings: SiteSettings | null
}

/** Where each floating chip sits around the phone, and how its float is timed. */
const CHIP_POSITIONS = [
  '-left-3 top-[14%] sm:-left-12 [animation-delay:0s]',
  '-right-3 top-[46%] sm:-right-12 [animation-delay:-2.4s]',
  '-left-1 bottom-[9%] sm:-left-8 [animation-delay:-4.6s]',
]

const PHONE_SIZES = '(min-width: 1024px) 320px, (min-width: 640px) 300px, 64vw'

export function Hero({hero, settings}: HeroProps) {
  const headline = hero.headline ?? ''
  const parts = splitHighlight(headline, hero.highlight)
  const socials = (settings?.socialLinks ?? []).filter((link) => link.followerCount).slice(0, 4)
  const chips = (hero.statChips ?? []).slice(0, 3)
  const hasImage = hasAsset(hero.image)
  const showVideo = hero.mediaType === 'video' && Boolean(hero.videoUrl)
  const hasMedia = hasImage || showVideo

  const posterImage = hasImage ? (
    <SanityImage
      image={hero.image}
      aspectRatio={9 / 16}
      maxWidth={720}
      sizes={PHONE_SIZES}
      preload
      fill
      className="object-cover"
    />
  ) : null

  return (
    <section className="shell relative pb-16 pt-10 md:pb-24 md:pt-16">
      <div className={cn('grid items-center gap-14 lg:gap-8', hasMedia && 'lg:grid-cols-12')}>
        <div className={cn(hasMedia ? 'lg:col-span-7' : 'max-w-5xl')}>
          {hero.eyebrow && (
            <p className="text-label mb-6 flex items-center gap-3 text-ink-3 motion-safe:animate-rise">
              <span aria-hidden className="h-px w-8 bg-accent" />
              {hero.eyebrow}
            </p>
          )}

          <h1 className="text-display-xl motion-safe:animate-rise">
            {parts ? (
              <>
                {parts.before}
                <em className="text-accent-display">{parts.match}</em>
                {parts.after}
              </>
            ) : (
              headline
            )}
          </h1>

          {hero.subheadline && (
            <p className="text-lead mt-7 max-w-xl text-ink-2 motion-safe:animate-rise motion-safe:[animation-delay:80ms]">
              {hero.subheadline}
            </p>
          )}

          {(hero.primaryCta?.href || hero.secondaryCta?.href) && (
            <div className="mt-9 flex flex-wrap gap-3 motion-safe:animate-rise motion-safe:[animation-delay:160ms]">
              {hero.primaryCta?.href && hero.primaryCta.label && (
                <ButtonLink href={hero.primaryCta.href} size="lg">
                  {hero.primaryCta.label}
                  <ArrowDownRight
                    aria-hidden
                    className="size-[1.125rem] transition-transform duration-300 ease-out-expo group-hover/button:translate-x-0.5 group-hover/button:translate-y-0.5"
                  />
                </ButtonLink>
              )}
              {hero.secondaryCta?.href && hero.secondaryCta.label && (
                <ButtonLink href={hero.secondaryCta.href} size="lg" variant="secondary">
                  {hero.secondaryCta.label}
                  <ArrowUpRight aria-hidden className="size-[1.125rem]" />
                </ButtonLink>
              )}
            </div>
          )}

          {socials.length > 0 && (
            <ul
              aria-label="Audience across platforms"
              className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6 motion-safe:animate-rise motion-safe:[animation-delay:240ms]"
            >
              {socials.map((link) => (
                <li key={link._key} className="flex items-center gap-2.5">
                  <PlatformIcon platform={link.platform} className="size-[1.125rem] text-ink-3" />
                  <span>
                    <span className="font-display text-2xl leading-none">{link.followerCount}</span>{' '}
                    <span className="text-label text-ink-3">
                      <span className="sr-only">followers on </span>
                      {PLATFORM_TITLES[link.platform]}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasMedia && (
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-[64vw] max-w-[18.75rem] lg:max-w-[20rem]">
              {/* A soft accent glow behind the phone. */}
              <span
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-full bg-accent opacity-20 blur-3xl"
              />
              <PhoneFrame>
                {showVideo && hero.videoUrl ? (
                  <LoopingVideo
                    src={hero.videoUrl}
                    poster={posterImage}
                    className="absolute inset-0"
                  />
                ) : (
                  posterImage
                )}
              </PhoneFrame>

              {chips.map((chip, index) => (
                <p
                  key={chip._key}
                  className={cn(
                    'absolute z-10 flex flex-col rounded-lg border border-line bg-card px-4 py-3 shadow-soft motion-safe:animate-float',
                    CHIP_POSITIONS[index],
                  )}
                >
                  <span className="font-display text-[1.75rem] leading-none">{chip.value}</span>
                  <span className="text-label mt-1.5 text-ink-3">{chip.label}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
