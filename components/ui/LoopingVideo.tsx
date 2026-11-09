'use client'

import {useInView, useReducedMotion} from 'motion/react'
import {useEffect, useRef, useState, type ReactNode} from 'react'

interface LoopingVideoProps {
  src: string
  /** The cover image. It is what loads first and what reduced-motion visitors see. */
  poster: ReactNode
  className?: string
}

/**
 * A silent, looping background-style video that costs nothing up front: the
 * poster image renders immediately, and the video file is only requested once
 * the element is on screen and the page has finished loading. Visitors who
 * prefer reduced motion (or have data saver on) keep the still image.
 */
export function LoopingVideo({src, poster, className}: LoopingVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(containerRef, {amount: 0.25})
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduceMotion) return
    const connection = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection
    if (connection?.saveData) return

    const enable = () => setEnabled(true)
    if (document.readyState === 'complete') {
      const timer = window.setTimeout(enable, 300)
      return () => window.clearTimeout(timer)
    }
    window.addEventListener('load', enable, {once: true})
    return () => window.removeEventListener('load', enable)
  }, [reduceMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (inView) {
      video.play().catch(() => {
        // Autoplay can be blocked (e.g. low-power mode); the poster stays visible.
      })
    } else {
      video.pause()
    }
  }, [inView, enabled])

  return (
    <div ref={containerRef} className={className}>
      {poster}
      {enabled && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setReady(true)}
          className="absolute inset-0 size-full object-cover transition-opacity duration-500"
          style={{opacity: ready ? 1 : 0}}
        />
      )}
    </div>
  )
}
