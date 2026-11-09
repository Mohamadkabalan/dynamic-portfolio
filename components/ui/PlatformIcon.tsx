import type {ReactNode, SVGProps} from 'react'

import {PLATFORM_TITLES} from '@/sanity/lib/constants'

/**
 * Simple outline glyphs for each social platform, drawn to match the lucide
 * icon set (24px grid, 2px rounded strokes). lucide no longer ships brand icons.
 */
const GLYPHS: Record<string, ReactNode> = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path d="M21 7.9v4.05a9.95 9.95 0 0 1-5-1.95v4.5a6.5 6.5 0 1 1-8-6.33v4.33a2.5 2.5 0 1 0 4 2V3h4.08A6 6 0 0 0 21 7.9Z" />
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  x: (
    <>
      <path d="M4 4l11.73 16H20L8.27 4Z" />
      <path d="M4 20l6.77-6.77M13.23 10.77 20 4" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3Z" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />,
  pinterest: (
    <>
      <path d="m8 20 4-9" />
      <path d="M10.7 14c.44 1.26 1.43 2 2.55 2 2.07 0 3.75-1.55 3.75-4a5 5 0 1 0-9.7 1.7" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  threads: (
    <path d="M19 7.5C17.67 4.5 15.33 3 12 3 7 3 4 5.5 4 12s3.5 9 8 9 7-3 7-5-1-5-7-5c-2.5 0-3 1.25-3 2.5C9 15 10 16 11.5 16c2.5 0 3.5-1.5 3.5-5s-2-4-3-4-1.83.33-2.5 1" />
  ),
}

interface PlatformIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  platform: string | null | undefined
  /** When true the icon is announced by screen readers; otherwise it is decorative. */
  labelled?: boolean
}

export function PlatformIcon({platform, labelled = false, ...props}: PlatformIconProps) {
  const glyph = platform ? GLYPHS[platform] : null
  if (!glyph) return null
  const title = PLATFORM_TITLES[platform as string] ?? platform

  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(labelled ? {role: 'img', 'aria-label': title ?? undefined} : {'aria-hidden': true})}
      {...props}
    >
      {glyph}
    </svg>
  )
}
