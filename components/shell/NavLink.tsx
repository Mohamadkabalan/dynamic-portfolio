'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import type {ReactNode} from 'react'

import {cn} from '@/lib/utils'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  onNavigate?: () => void
}

/** A navigation link that knows when it points at the current section. */
export function NavLink({href, children, className, activeClassName, onNavigate}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  )
}
