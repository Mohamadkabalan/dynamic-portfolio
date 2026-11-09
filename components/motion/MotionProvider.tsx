'use client'

import {LazyMotion, MotionConfig} from 'motion/react'
import type {ReactNode} from 'react'

/** The animation engine is loaded after the page is interactive, not with it. */
const loadFeatures = () => import('./features').then((module) => module.default)

/**
 * Wraps the site once. `reducedMotion="user"` makes every Motion animation
 * honour the visitor's "reduce motion" setting (transforms are skipped).
 */
export function MotionProvider({children}: {children: ReactNode}) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
