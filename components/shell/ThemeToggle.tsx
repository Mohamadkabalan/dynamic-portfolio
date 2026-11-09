'use client'

import {Moon, Sun} from 'lucide-react'
import {useEffect} from 'react'

import {cn} from '@/lib/utils'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/**
 * Switches between light and dark. The choice is remembered on this device;
 * until a choice is made the site follows the system setting.
 * Both icons are rendered and CSS shows the right one, so there is no flicker.
 */
export function ThemeToggle({className}: {className?: string}) {
  useEffect(() => {
    // Follow live system changes for visitors who have not chosen a theme.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null
      try {
        stored = localStorage.getItem('theme')
      } catch {}
      if (stored !== 'light' && stored !== 'dark') {
        document.documentElement.dataset.theme = event.matches ? 'dark' : 'light'
      }
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      title="Switch between light and dark mode"
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-ink/8',
        className,
      )}
    >
      <Moon aria-hidden className="size-[1.125rem] dark:hidden" />
      <Sun aria-hidden className="hidden size-[1.125rem] dark:block" />
    </button>
  )
}
