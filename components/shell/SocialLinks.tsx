import {PlatformIcon} from '@/components/ui/PlatformIcon'
import {cn, displayHandle} from '@/lib/utils'
import {PLATFORM_TITLES} from '@/sanity/lib/constants'
import type {SiteSettings} from '@/sanity/lib/data'

type SocialLink = NonNullable<SiteSettings['socialLinks']>[number]

interface SocialLinksProps {
  links: SocialLink[] | null | undefined
  /** `icons` = compact round buttons; `list` = rows with handle and follower count. */
  variant?: 'icons' | 'list'
  className?: string
}

export function SocialLinks({links, variant = 'icons', className}: SocialLinksProps) {
  const items = (links ?? []).filter((link) => link.url && link.platform)
  if (items.length === 0) return null

  if (variant === 'list') {
    return (
      <ul className={cn('divide-y divide-line border-y border-line', className)}>
        {items.map((link) => (
          <li key={link._key}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer me"
              className="group flex min-h-14 items-center gap-4 py-3 transition-colors hover:text-accent-ink"
            >
              <PlatformIcon platform={link.platform} className="size-5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">
                  {displayHandle(link.handle, link.url)}
                </span>
                <span className="text-label mt-0.5 block text-ink-3">
                  {PLATFORM_TITLES[link.platform]}
                </span>
              </span>
              {link.followerCount && (
                <span className="text-label shrink-0 text-ink-3">
                  {link.followerCount} <span className="sr-only">followers</span>
                </span>
              )}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {items.map((link) => (
        <li key={link._key}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`${PLATFORM_TITLES[link.platform]} (opens in a new tab)`}
            title={PLATFORM_TITLES[link.platform]}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors duration-200 hover:border-current hover:bg-ink hover:text-paper"
          >
            <PlatformIcon platform={link.platform} className="size-[1.125rem]" />
          </a>
        </li>
      ))}
    </ul>
  )
}
