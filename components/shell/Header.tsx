import Link from 'next/link'

import {Availability} from '@/components/shell/Availability'
import {MobileMenu} from '@/components/shell/MobileMenu'
import {NavLink} from '@/components/shell/NavLink'
import {SocialLinks} from '@/components/shell/SocialLinks'
import {ThemeToggle} from '@/components/shell/ThemeToggle'
import {ButtonLink} from '@/components/ui/Button'
import {SanityImage} from '@/components/ui/SanityImage'
import {NAV_LINKS, siteName} from '@/lib/site'
import type {SiteSettings} from '@/sanity/lib/data'
import {croppedAspectRatio, hasAsset} from '@/sanity/lib/image'

export function Header({settings}: {settings: SiteSettings | null}) {
  const name = siteName(settings)
  const logo = settings?.logo

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="shell flex h-(--header-h) items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${name} — home`}
          className="flex min-h-11 items-center font-display text-[1.375rem] leading-none tracking-tight"
        >
          {hasAsset(logo) ? (
            <SanityImage
              image={logo}
              alt={logo.alt || name}
              maxWidth={Math.round(64 * croppedAspectRatio(logo))}
              sizes="160px"
              className="h-8 w-auto max-w-40 object-contain dark:brightness-0 dark:invert"
            />
          ) : (
            name
          )}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] text-ink-2 transition-colors duration-200 hover:text-ink"
                  activeClassName="!text-ink underline decoration-accent decoration-2 underline-offset-8"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Availability
            isAvailable={settings?.availability?.isAvailable}
            text={settings?.availability?.text}
            className="mr-3 hidden lg:inline-flex"
          />
          <ThemeToggle />
          <ButtonLink href="/contact" className="ml-1 hidden md:inline-flex">
            Let&rsquo;s talk
          </ButtonLink>
          <MobileMenu>
            <Availability
              isAvailable={settings?.availability?.isAvailable}
              text={settings?.availability?.text}
            />
            <SocialLinks links={settings?.socialLinks} />
          </MobileMenu>
        </div>
      </div>
    </header>
  )
}
