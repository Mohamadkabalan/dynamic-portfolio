import type {SectionCopy} from '@/components/sections/HomeSections'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {WorkFilter} from '@/components/work/WorkFilter'
import type {CaseStudyCard} from '@/sanity/lib/data'

/** Every case study, with platform and industry filters. The "Work" link in the menu lands here. */
export function WorkSection({studies, copy}: {studies: CaseStudyCard[]; copy: SectionCopy}) {
  if (studies.length === 0) return null

  return (
    <section id="work" aria-labelledby="work-heading" className="shell section-y">
      <SectionHeading
        id="work-heading"
        {...copy}
        eyebrow={
          copy.eyebrow ? (
            <>
              {copy.eyebrow}
              <span className="tabular"> · {studies.length}</span>
            </>
          ) : null
        }
      />
      <div className="mt-10 md:mt-14">
        <WorkFilter studies={studies} />
      </div>
    </section>
  )
}
