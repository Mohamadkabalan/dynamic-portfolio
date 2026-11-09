'use client'

import {useMemo, useState} from 'react'

import {FeedLightbox} from '@/components/feed/FeedLightbox'
import {FeedTile} from '@/components/feed/FeedTile'
import {FilterChips} from '@/components/ui/FilterChips'
import {PlatformIcon} from '@/components/ui/PlatformIcon'
import {PLATFORMS} from '@/sanity/lib/constants'
import type {FeedItem} from '@/sanity/lib/data'

const TILE_SIZES = '(min-width: 1024px) 290px, (min-width: 768px) 33vw, 50vw'

interface FeedGridProps {
  items: FeedItem[]
  /** Hide the platform filter (used for the small related-content grids). */
  showFilter?: boolean
}

/**
 * The content feed: a masonry grid of posts, carousels, reels and stories with
 * a platform filter. Clicking a tile opens the lightbox.
 */
export function FeedGrid({items, showFilter = true}: FeedGridProps) {
  const [platform, setPlatform] = useState<string>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Only offer platforms that actually have content, in the canonical order.
  const options = useMemo(() => {
    const present = new Set(items.map((item) => item.platform))
    return PLATFORMS.filter((option) => present.has(option.value)).map((option) => ({
      value: option.value as string,
      label: option.title as string,
      icon: <PlatformIcon platform={option.value} className="size-4" />,
    }))
  }, [items])

  const visible = useMemo(
    () => (platform === 'all' ? items : items.filter((item) => item.platform === platform)),
    [items, platform],
  )

  return (
    <>
      {showFilter && options.length > 1 && (
        <FilterChips
          label="Filter the feed by platform"
          options={options}
          value={platform}
          onChange={(next) => {
            setPlatform(next)
            setOpenIndex(null)
          }}
          className="mb-8"
        />
      )}

      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {visible.map((item, index) => (
          <li
            key={`${platform}-${item._id}`}
            className="mb-3 break-inside-avoid motion-safe:animate-rise sm:mb-4"
            style={{animationDelay: `${Math.min(index, 8) * 50}ms`}}
          >
            <FeedTile item={item} onOpen={() => setOpenIndex(index)} sizes={TILE_SIZES} />
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} {visible.length === 1 ? 'item' : 'items'}
      </p>

      <FeedLightbox items={visible} index={openIndex} onChange={setOpenIndex} />
    </>
  )
}
