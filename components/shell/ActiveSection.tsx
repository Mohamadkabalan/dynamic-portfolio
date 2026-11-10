'use client'

import {usePathname} from 'next/navigation'
import {createContext, useContext, useEffect, useState, type ReactNode} from 'react'

import {NAV_LINKS} from '@/lib/site'

const ActiveSectionContext = createContext<string | null>(null)

/**
 * Keeps track of which navigation section is in view on the one-page site,
 * so the header can highlight the matching link while the visitor scrolls.
 */
export function ActiveSectionProvider({children}: {children: ReactNode}) {
  const pathname = usePathname()
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (pathname !== '/') return

    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (element): element is HTMLElement => element !== null,
    )
    if (sections.length === 0) return

    // A section counts as current while it crosses a thin band just above the
    // middle of the viewport, so exactly one link is highlighted at a time.
    const inView = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target.id)
          else inView.delete(entry.target.id)
        }
        setActive(NAV_LINKS.find((link) => inView.has(link.id))?.id ?? null)
      },
      {rootMargin: '-40% 0px -55% 0px', threshold: 0},
    )
    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [pathname])

  return (
    <ActiveSectionContext.Provider value={pathname === '/' ? active : null}>
      {children}
    </ActiveSectionContext.Provider>
  )
}

/** The `id` of the navigation section currently in view, or null. */
export function useActiveSection(): string | null {
  return useContext(ActiveSectionContext)
}
