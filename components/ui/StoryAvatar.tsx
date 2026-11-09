import {SanityImage} from '@/components/ui/SanityImage'
import {cn} from '@/lib/utils'
import {hasAsset, type CmsImage} from '@/sanity/lib/image'

interface StoryAvatarProps {
  image: CmsImage | null | undefined
  name: string
  /** Diameter in pixels. */
  size?: number
  /** A "seen" story gets a muted ring, like on Instagram. */
  seen?: boolean
  className?: string
}

/** A round avatar with a gradient "story" ring. Falls back to initials. */
export function StoryAvatar({image, name, size = 64, seen = false, className}: StoryAvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <span
      className={cn(
        'inline-flex shrink-0 rounded-full p-[3px] transition-[filter,opacity] duration-300',
        seen ? 'bg-line-strong' : 'story-ring',
        className,
      )}
      style={{width: size, height: size}}
    >
      <span className="relative flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-paper bg-paper-2">
        {hasAsset(image) ? (
          <SanityImage
            image={image}
            alt=""
            aspectRatio={1}
            maxWidth={size * 2}
            sizes={`${size}px`}
            className="size-full object-cover"
          />
        ) : (
          <span aria-hidden className="font-display text-ink-2" style={{fontSize: size * 0.36}}>
            {initials}
          </span>
        )}
      </span>
    </span>
  )
}
