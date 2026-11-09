import {cn} from '@/lib/utils'

interface AvailabilityProps {
  isAvailable: boolean | null | undefined
  text: string | null | undefined
  className?: string
}

/** The small status badge: a pulsing dot when open to work, a hollow one when booked. */
export function Availability({isAvailable, text, className}: AvailabilityProps) {
  if (!text?.trim()) return null
  const available = isAvailable !== false

  return (
    <p className={cn('inline-flex items-center gap-2.5 text-sm text-ink-2', className)}>
      <span aria-hidden className="relative flex size-2.5">
        {available && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        )}
        <span
          className={cn(
            'relative inline-flex size-2.5 rounded-full',
            available ? 'bg-emerald-500' : 'border-2 border-ink-3',
          )}
        />
      </span>
      <span className="sr-only">{available ? 'Available: ' : 'Not available: '}</span>
      {text}
    </p>
  )
}
