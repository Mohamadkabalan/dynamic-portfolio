/**
 * Turns a link pasted by the editor (YouTube, Vimeo, Instagram, TikTok) into
 * an embeddable player address. Unknown links return null and are shown as a
 * normal link instead.
 */
export interface EmbedInfo {
  provider: 'youtube' | 'vimeo' | 'instagram' | 'tiktok'
  src: string
  /** Width ÷ height of the player. */
  aspectRatio: number
  title: string
}

export function parseEmbed(input: string | null | undefined): EmbedInfo | null {
  if (!input) return null
  let url: URL
  try {
    url = new URL(input)
  } catch {
    return null
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, '')
  const segments = url.pathname.split('/').filter(Boolean)

  if (host === 'youtu.be' && segments[0]) {
    return youtube(segments[0], false)
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (segments[0] === 'shorts' && segments[1]) return youtube(segments[1], true)
    if (segments[0] === 'embed' && segments[1]) return youtube(segments[1], false)
    const id = url.searchParams.get('v')
    if (id) return youtube(id, false)
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = segments.find((segment) => /^\d+$/.test(segment))
    if (id) {
      return {
        provider: 'vimeo',
        src: `https://player.vimeo.com/video/${id}?dnt=1`,
        aspectRatio: 16 / 9,
        title: 'Vimeo video',
      }
    }
  }
  if (host === 'instagram.com') {
    const kind = segments.find((segment) => ['p', 'reel', 'reels', 'tv'].includes(segment))
    const id = kind ? segments[segments.indexOf(kind) + 1] : undefined
    if (kind && id && /^[\w-]+$/.test(id)) {
      const path = kind === 'reels' ? 'reel' : kind
      return {
        provider: 'instagram',
        src: `https://www.instagram.com/${path}/${id}/embed/`,
        aspectRatio: 4 / 5.6,
        title: 'Instagram post',
      }
    }
  }
  if (host === 'tiktok.com') {
    const index = segments.indexOf('video')
    const id = index >= 0 ? segments[index + 1] : undefined
    if (id && /^\d+$/.test(id)) {
      return {
        provider: 'tiktok',
        src: `https://www.tiktok.com/embed/v2/${id}`,
        aspectRatio: 9 / 16,
        title: 'TikTok video',
      }
    }
  }
  return null
}

function youtube(id: string, vertical: boolean): EmbedInfo | null {
  if (!/^[\w-]{6,}$/.test(id)) return null
  return {
    provider: 'youtube',
    src: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
    aspectRatio: vertical ? 9 / 16 : 16 / 9,
    title: 'YouTube video',
  }
}
