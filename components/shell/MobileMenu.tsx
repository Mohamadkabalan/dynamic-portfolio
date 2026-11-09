'use client'

import {Menu, X} from 'lucide-react'
import {usePathname} from 'next/navigation'
import {useEffect, useRef, type ReactNode} from 'react'

import {NavLink} from '@/components/shell/NavLink'
import {NAV_LINKS} from '@/lib/site'

interface MobileMenuProps {
  /** Extra content shown under the links (availability, social links). */
  children?: ReactNode
}

/**
 * Full-screen navigation for small screens, built on the native <dialog>
 * element: focus is trapped inside while open, Escape closes it, and focus
 * returns to the menu button afterwards.
 */
export function MobileMenu({children}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()

  const close = () => dialogRef.current?.close()

  // Close after navigating (including with the browser's back button).
  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        aria-label="Open menu"
        className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/8 md:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-paper p-0 text-ink backdrop:bg-transparent open:animate-page-in md:hidden"
      >
        <div className="flex h-full flex-col px-(--gutter) pb-8">
          <div className="flex h-(--header-h) shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/8"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <nav aria-label="Main" className="flex flex-1 flex-col justify-center">
            <ul className="flex flex-col">
              <li className="border-b border-line">
                <NavLink
                  href="/"
                  onNavigate={close}
                  className="text-display-lg block py-4"
                  activeClassName="italic text-accent-display"
                >
                  Home
                </NavLink>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <NavLink
                    href={link.href}
                    onNavigate={close}
                    className="text-display-lg block py-4"
                    activeClassName="italic text-accent-display"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {children && <div className="shrink-0 space-y-5">{children}</div>}
        </div>
      </dialog>
    </>
  )
}
