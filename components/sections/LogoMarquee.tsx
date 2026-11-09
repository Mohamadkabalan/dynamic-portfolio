import {SanityImage} from '@/components/ui/SanityImage'
import {cn} from '@/lib/utils'
import type {LogoClient} from '@/sanity/lib/data'
import {croppedAspectRatio, hasAsset} from '@/sanity/lib/image'

interface LogoMarqueeProps {
  clients: LogoClient[]
  heading?: string | null
}

function Logo({client}: {client: LogoClient}) {
  if (hasAsset(client.logo)) {
    return (
      <SanityImage
        image={client.logo}
        alt={client.logo.alt || client.name}
        maxWidth={Math.round(72 * Math.min(croppedAspectRatio(client.logo), 5))}
        sizes="160px"
        className="h-8 w-auto max-w-40 object-contain opacity-65 brightness-0 dark:invert"
      />
    )
  }
  return (
    <span className="whitespace-nowrap font-display text-2xl italic text-ink-2">{client.name}</span>
  )
}

/**
 * An endlessly scrolling strip of client logos (pure CSS). It pauses on hover
 * and keyboard focus, and becomes a static wrapped row when the visitor
 * prefers reduced motion.
 */
export function LogoMarquee({clients, heading}: LogoMarqueeProps) {
  if (clients.length === 0) return null

  // Repeat short lists so the strip is always wider than the screen.
  const repeats = Math.max(1, Math.ceil(10 / clients.length))
  const half = Array.from({length: repeats}, () => clients).flat()
  const duration = `${Math.max(24, half.length * 4)}s`

  return (
    <section aria-label={heading || 'Clients'} className="border-y border-line py-9">
      {heading && <p className="text-label shell mb-7 text-center text-ink-3">{heading}</p>}
      <div
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        style={{'--marquee-duration': duration} as React.CSSProperties}
      >
        <ul className="marquee-track flex w-max animate-marquee items-center group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) =>
            half.map((client, index) => {
              // Only the first run of logos is announced; the rest is visual repetition.
              const isOriginal = copy === 0 && index < clients.length
              return (
                <li
                  key={`${copy}-${index}`}
                  aria-hidden={isOriginal ? undefined : true}
                  className={cn(
                    'flex h-12 shrink-0 items-center px-7 md:px-10',
                    !isOriginal && 'marquee-clone',
                  )}
                >
                  <Logo client={client} />
                </li>
              )
            }),
          )}
        </ul>
      </div>
    </section>
  )
}
