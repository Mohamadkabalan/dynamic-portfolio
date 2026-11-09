'use client'

import * as m from 'motion/react-m'
import type {ReactNode} from 'react'

const EASE = [0.22, 1, 0.36, 1] as const
const VIEWPORT = {once: true, amount: 0.15} as const

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds to wait before animating. */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * Fades and lifts its content into place the first time it scrolls into view.
 * Only for content below the fold — the hero uses CSS so it never waits for JS.
 */
export function Reveal({children, className, delay = 0, as = 'div'}: RevealProps) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial={{opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={VIEWPORT}
      transition={{duration: 0.7, ease: EASE, delay}}
    >
      {children}
    </Tag>
  )
}

interface StaggerProps {
  children: ReactNode
  className?: string
  /** Seconds between each child. */
  interval?: number
  as?: 'div' | 'ul' | 'ol' | 'dl'
}

/** A grid or list whose items reveal one after another. Use with `StaggerItem`. */
export function Stagger({children, className, interval = 0.07, as = 'div'}: StaggerProps) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, amount: 0.1}}
      variants={{hidden: {}, visible: {transition: {staggerChildren: interval}}}}
    >
      {children}
    </Tag>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}

export function StaggerItem({children, className, as = 'div'}: StaggerItemProps) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      variants={{
        hidden: {opacity: 0, y: 24},
        visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: EASE}},
      }}
    >
      {children}
    </Tag>
  )
}
