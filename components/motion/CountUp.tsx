'use client'

import {animate, useInView, useReducedMotion} from 'motion/react'
import {useEffect, useRef} from 'react'

import {decimalPlaces} from '@/lib/utils'

interface CountUpProps {
  value: number
  prefix?: string | null
  suffix?: string | null
  className?: string
  /** Seconds. */
  duration?: number
}

function format(value: number, decimals: number): string {
  return value.toLocaleString('en', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * A number that counts up once when it scrolls into view.
 *
 * The final value is what is rendered in the HTML, so it is correct without
 * JavaScript, for search engines and for screen readers. With "reduce motion"
 * switched on it simply stays at the final value.
 */
export function CountUp({value, prefix, suffix, className, duration = 1.6}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, {once: true, amount: 0.6})
  const reduceMotion = useReducedMotion()
  const decimals = decimalPlaces(value)

  useEffect(() => {
    const node = ref.current
    if (!node || !inView || reduceMotion) return

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest, decimals)
      },
      onComplete: () => {
        node.textContent = format(value, decimals)
      },
    })
    return () => controls.stop()
  }, [inView, reduceMotion, value, decimals, duration])

  const finalText = `${prefix ?? ''}${format(value, decimals)}${suffix ?? ''}`

  return (
    <span className={className}>
      {/* Screen readers get the final figure once, not every frame. */}
      <span className="sr-only">{finalText}</span>
      <span aria-hidden className="tabular">
        {prefix}
        <span ref={ref}>{format(value, decimals)}</span>
        {suffix}
      </span>
    </span>
  )
}
