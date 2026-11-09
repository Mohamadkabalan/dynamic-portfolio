'use client'

import type {ReactNode} from 'react'

import {cn} from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
  icon?: ReactNode
}

interface FilterChipsProps {
  /** Describes the group for screen readers, e.g. "Filter by platform". */
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  /** Text of the "show everything" chip. */
  allLabel?: string
  className?: string
}

/**
 * A row of toggle chips for filtering a list. On phones the row scrolls
 * sideways instead of wrapping, like the filter bar in a social app.
 */
export function FilterChips({
  label,
  options,
  value,
  onChange,
  allLabel = 'All',
  className,
}: FilterChipsProps) {
  const all: FilterOption[] = [{value: 'all', label: allLabel}, ...options]

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'no-scrollbar -mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0',
        className,
      )}
    >
      {all.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-medium transition-colors duration-200',
              selected
                ? 'border-ink bg-ink text-paper'
                : 'border-line-strong text-ink-2 hover:border-ink hover:text-ink',
            )}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
