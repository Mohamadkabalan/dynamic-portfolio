import type {ReactNode} from 'react'

import {cn} from '@/lib/utils'

interface PhoneFrameProps {
  children: ReactNode
  className?: string
  /** Shows the small camera cut-out at the top. */
  notch?: boolean
  /** A smaller bezel and corner radius, for phones shown in a grid. */
  compact?: boolean
}

/**
 * A phone mock-up (9:16 screen) used to show reels and stories the way they
 * are seen on social. The frame is decorative; the content inside carries the
 * meaning for assistive technology.
 */
export function PhoneFrame({children, className, notch = true, compact = false}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative bg-[#161412] ring-1 ring-white/10',
        compact ? 'rounded-[1.75rem] p-[0.3125rem] shadow-soft' : 'rounded-phone p-[0.4375rem] shadow-lift',
        className,
      )}
    >
      <div
        className={cn(
          'relative aspect-9/16 overflow-hidden bg-[#0b0a09]',
          compact ? 'rounded-[1.4375rem]' : 'rounded-[2.3125rem]',
        )}
      >
        {children}
        {notch && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/85',
              compact ? 'top-2 h-3 w-12' : 'top-2.5 h-[1.125rem] w-[4.5rem]',
            )}
          />
        )}
      </div>
    </div>
  )
}
