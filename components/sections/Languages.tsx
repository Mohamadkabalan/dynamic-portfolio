import {Reveal, Stagger, StaggerItem} from '@/components/motion/Reveal'
import {Eyebrow} from '@/components/ui/SectionHeading'
import {cn} from '@/lib/utils'
import {
  LANGUAGE_LEVEL_MAX,
  LANGUAGE_LEVEL_SCORES,
  LANGUAGE_LEVEL_TITLES,
} from '@/sanity/lib/constants'
import type {AboutData} from '@/sanity/lib/data'

type Language = NonNullable<NonNullable<AboutData['page']>['languages']>[number]

interface LanguagesSectionProps {
  languages: Language[]
  heading?: string | null
}

/** The languages the editor works in, each with a five-segment proficiency meter. */
export function LanguagesSection({languages, heading}: LanguagesSectionProps) {
  if (languages.length === 0) return null

  return (
    <section aria-labelledby="languages-heading" className="bg-paper-2">
      <div className="shell section-y grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow className="mb-5">Languages</Eyebrow>
          <h2 id="languages-heading" className="text-display-lg">
            {heading?.trim() || 'Languages I work in'}
          </h2>
        </Reveal>
        <Stagger
          as="ul"
          className="grid content-start gap-x-10 border-t border-line sm:grid-cols-2 lg:col-span-8"
        >
          {languages.map((language) => {
            const level = language.level ?? ''
            const score = LANGUAGE_LEVEL_SCORES[level] ?? 0
            const levelTitle = LANGUAGE_LEVEL_TITLES[level] ?? level
            return (
              <StaggerItem as="li" key={language._key} className="border-b border-line py-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-display-sm">{language.name}</h3>
                  {levelTitle && <p className="text-label text-ink-3">{levelTitle}</p>}
                </div>
                <ProficiencyMeter score={score} />
                {language.note && <p className="mt-3 text-sm text-ink-2">{language.note}</p>}
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}

/** Decorative: the proficiency is already spelled out in the label next to the name. */
function ProficiencyMeter({score}: {score: number}) {
  return (
    <div aria-hidden className="mt-5 grid grid-cols-5 gap-1.5">
      {Array.from({length: LANGUAGE_LEVEL_MAX}, (_, index) => (
        <span
          key={index}
          className={cn('h-1.5 rounded-full', index < score ? 'bg-accent' : 'bg-line-strong')}
        />
      ))}
    </div>
  )
}
