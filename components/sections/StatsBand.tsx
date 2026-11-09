import {CountUp} from '@/components/motion/CountUp'
import {Reveal, Stagger, StaggerItem} from '@/components/motion/Reveal'
import type {Stat} from '@/sanity/lib/data'

interface StatsBandProps {
  stats: Stat[]
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
}

/** The inverted "by the numbers" band with count-up figures. */
export function StatsBand({stats, eyebrow, heading, intro}: StatsBandProps) {
  if (stats.length === 0) return null

  return (
    <section aria-labelledby="stats-heading" className="on-inverse bg-inverse text-on-inverse">
      <div className="shell py-16 md:py-24">
        <Reveal className="max-w-3xl">
          {eyebrow && (
            <p className="text-label mb-5 flex items-center gap-3 text-on-inverse-2">
              <span aria-hidden className="h-px w-8 bg-accent" />
              {eyebrow}
            </p>
          )}
          <h2 id="stats-heading" className={heading ? 'text-display-md' : 'sr-only'}>
            {heading || 'By the numbers'}
          </h2>
          {intro && <p className="text-lead mt-4 text-on-inverse-2">{intro}</p>}
        </Reveal>

        <Stagger
          as="ul"
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-4 lg:gap-x-10"
        >
          {stats.map((stat) => (
            <StaggerItem
              as="li"
              key={stat._id}
              className="flex flex-col border-t border-on-inverse/20 pt-5"
            >
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-[clamp(2.75rem,1.8rem+5vw,5.5rem)] leading-none tracking-tight"
              />
              <span className="mt-4 font-medium">{stat.label}</span>
              {stat.description && (
                <span className="mt-1 text-sm text-on-inverse-2">{stat.description}</span>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
