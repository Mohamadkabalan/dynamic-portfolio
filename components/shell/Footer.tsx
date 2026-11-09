import {ArrowUp, ArrowUpRight} from 'lucide-react'
import Link from 'next/link'

import {SocialLinks} from '@/components/shell/SocialLinks'
import {NAV_LINKS, siteName, siteTitle} from '@/lib/site'
import type {SiteSettings} from '@/sanity/lib/data'

export function Footer({settings}: {settings: SiteSettings | null}) {
  const name = siteName(settings)
  const email = settings?.contactEmail

  return (
    <footer className="border-t border-line">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            {settings?.footerText && (
              <p className="text-display-md max-w-2xl">{settings.footerText}</p>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="group mt-8 inline-flex min-h-11 items-center gap-2 text-lead underline decoration-line-strong underline-offset-8 transition-colors hover:decoration-accent"
              >
                {email}
                <ArrowUpRight
                  aria-hidden
                  className="size-5 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:justify-items-end">
            <nav aria-label="Footer">
              <p className="text-label mb-4 text-ink-3">Explore</p>
              <ul className="space-y-1">
                {[{href: '/', label: 'Home'}, ...NAV_LINKS].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-10 items-center text-ink-2 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="text-label mb-4 text-ink-3">Follow</p>
              <SocialLinks links={settings?.socialLinks} className="max-w-44" />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {name}
            <span aria-hidden> · </span>
            <span className="block sm:inline">{siteTitle(settings)}</span>
            {settings?.location && (
              <>
                <span aria-hidden className="hidden sm:inline"> · </span>
                <span className="block sm:inline">{settings.location}</span>
              </>
            )}
          </p>
          <a
            href="#top"
            className="inline-flex min-h-11 items-center gap-2 self-start transition-colors hover:text-ink sm:self-auto"
          >
            Back to top <ArrowUp aria-hidden className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
