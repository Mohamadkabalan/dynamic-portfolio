import type {ReactNode} from 'react'

import {Reveal} from '@/components/motion/Reveal'
import {cn} from '@/lib/utils'

export function Eyebrow({children, className}: {children: ReactNode; className?: string}) {
  return (
    <p className={cn('text-label flex items-center gap-3 text-ink-3', className)}>
      <span aria-hidden className="h-px w-8 bg-accent" />
      {children}
    </p>
  )
}

interface SectionHeadingProps {
  id?: string
  eyebrow?: string | null
  heading: string
  intro?: string | null
  /** Optional element aligned to the right of the heading on wide screens (e.g. a link). */
  action?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}

/** The standard heading block that opens every section. */
export function SectionHeading({
  id,
  eyebrow,
  heading,
  intro,
  action,
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-3xl">
        {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
        <Tag id={id} className="text-display-lg">
          {heading}
        </Tag>
        {intro && <p className="text-lead mt-5 max-w-prose-editorial text-ink-2">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  )
}
