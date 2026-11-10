'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import type {ReactNode} from 'react'

import {useActiveSection} from '@/components/shell/ActiveSection'
import {cn} from '@/lib/utils'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  onNavigate?: () => void
}

/**
 * A navigation link that knows when it points at the current section
 * (a "/#section" link on the home page) or the current page.
 */
export function NavLink({href, children, className, activeClassName, onNavigate}: NavLinkProps) {
  const pathname = usePathname()
  const activeSection = useActiveSection()
  const section = href.startsWith('/#') ? href.slice(2) : null
  const isActive = section
    ? pathname === '/' && activeSection === section
    : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={isActive ? (section ? 'location' : 'page') : undefined}
      onClick={onNavigate}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  )
}
