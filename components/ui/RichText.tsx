import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'
import type {ComponentProps} from 'react'

import {EmbedPlayer} from '@/components/ui/EmbedPlayer'
import {SanityImage} from '@/components/ui/SanityImage'
import {cn, isExternalHref} from '@/lib/utils'
import {hasAsset, staticImageUrl, type CmsImage} from '@/sanity/lib/image'

type PortableTextValue = ComponentProps<typeof PortableText>['value']

interface FigureValue extends Omit<CmsImage, 'alt' | 'extension'> {
  alt?: string | null
  caption?: string | null
}

interface VideoValue {
  url?: string | null
  caption?: string | null
  poster?: CmsImage | null
}

interface EmbedValue {
  url?: string | null
  caption?: string | null
}

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
    h3: ({children}) => <h3 className="text-display-sm mt-12 first:mt-0">{children}</h3>,
    h4: ({children}) => <h4 className="mt-8 text-lg font-semibold first:mt-0">{children}</h4>,
    blockquote: ({children}) => (
      <blockquote className="text-display-sm my-10 border-l-2 border-accent pl-6 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="list-disc space-y-2 pl-5 marker:text-accent-ink">{children}</ul>,
    number: ({children}) => <ol className="list-decimal space-y-2 pl-5 marker:text-ink-3">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const className =
        'text-accent-ink underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent'
      if (isExternalHref(href)) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {children}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )
      }
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      )
    },
  },
  types: {
    figure: ({value}: {value: FigureValue}) => {
      const image: CmsImage = {...value, alt: value.alt ?? null}
      if (!hasAsset(image)) return null
      return (
        <figure className="my-10">
          <SanityImage
            image={image}
            maxWidth={1600}
            sizes="(min-width: 1024px) 760px, 100vw"
            className="h-auto w-full rounded-lg bg-paper-2"
          />
          {value.caption && (
            <figcaption className="mt-3 text-sm text-ink-3">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
    videoFile: ({value}: {value: VideoValue}) => {
      if (!value.url) return null
      const poster = hasAsset(value.poster) ? value.poster : null
      return (
        <figure className="my-10">
          <video
            src={value.url}
            poster={poster ? staticImageUrl(poster, {width: 1280, format: 'jpg'}) : undefined}
            controls
            playsInline
            preload="none"
            aria-label={poster?.alt || value.caption || 'Video'}
            className="aspect-video w-full rounded-lg bg-black object-contain"
          />
          {value.caption && (
            <figcaption className="mt-3 text-sm text-ink-3">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
    embed: ({value}: {value: EmbedValue}) => {
      if (!value.url) return null
      return (
        <figure className="my-10">
          <EmbedPlayer url={value.url} title={value.caption} className="mx-auto max-w-xl" />
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-ink-3">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
}

interface RichTextProps {
  value: PortableTextValue | null | undefined
  className?: string
}

/** Renders formatted text from the CMS (bio, challenge, strategy, execution). */
export function RichText({value, className}: RichTextProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className={cn('text-lead space-y-5 text-ink-2', className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
