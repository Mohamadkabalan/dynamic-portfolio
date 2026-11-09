import {ExternalLink} from 'lucide-react'

import {parseEmbed} from '@/lib/embed'
import {cn} from '@/lib/utils'

interface EmbedPlayerProps {
  url: string
  title?: string | null
  className?: string
}

/**
 * Shows a YouTube, Vimeo, Instagram or TikTok link as a lazy-loaded player.
 * Links from any other site fall back to a plain "open" link.
 */
export function EmbedPlayer({url, title, className}: EmbedPlayerProps) {
  const embed = parseEmbed(url)

  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex min-h-11 items-center gap-2 underline decoration-line-strong underline-offset-4 hover:decoration-accent',
          className,
        )}
      >
        {title || 'Open the original post'}
        <ExternalLink aria-hidden className="size-4" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }

  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-lg bg-paper-2', className)}
      style={{aspectRatio: embed.aspectRatio}}
    >
      <iframe
        src={embed.src}
        title={title || embed.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 size-full border-0"
      />
    </div>
  )
}
