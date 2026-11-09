import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

import {ImageResponse} from 'next/og'

import {accentTokens, PAPER_LIGHT} from '@/lib/color'

/**
 * Shared pieces for the generated social-sharing images (1200 × 630).
 * They are drawn with `next/og` from CMS data — see app/og/.
 *
 * Note: the renderer (Satori) only understands flexbox and inline styles.
 */

export const OG_SIZE = {width: 1200, height: 630} as const

const INK = '#151311'
const MUTED = '#5C574F'

const fontsDirectory = join(process.cwd(), 'assets', 'fonts')

// Loaded once per server instance.
const fonts = Promise.all([
  readFile(join(fontsDirectory, 'InstrumentSerif-Regular.ttf')),
  readFile(join(fontsDirectory, 'InstrumentSerif-Italic.ttf')),
]).then(([regular, italic]) => [
  {name: 'Instrument Serif', data: regular, weight: 400 as const, style: 'normal' as const},
  {name: 'Instrument Serif', data: italic, weight: 400 as const, style: 'italic' as const},
])

async function render(element: React.ReactElement): Promise<ImageResponse> {
  return new ImageResponse(element, {...OG_SIZE, fonts: await fonts})
}

function clamp(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

/**
 * Downloads an image and inlines it, so the renderer never has to make its own
 * network request. If the download fails the card is simply drawn without it.
 */
async function inlineImage(url: string | null | undefined): Promise<string | null> {
  if (!url) return null
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const type = response.headers.get('content-type') ?? 'image/jpeg'
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.byteLength > 3_000_000) return null
    return `data:${type};base64,${bytes.toString('base64')}`
  } catch {
    return null
  }
}

interface SiteCardInput {
  name: string
  title: string
  accentColor?: string | null
  domain: string
}

/** The default card: name, job title and the accent colour. */
export function siteCard({name, title, accentColor, domain}: SiteCardInput) {
  const {accent, onAccent} = accentTokens(accentColor)

  return render(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: PAPER_LIGHT,
        color: INK,
        fontFamily: 'Instrument Serif',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', fontSize: 30, color: MUTED}}>
          <div style={{width: 56, height: 2, background: accent, marginRight: 20}} />
          Portfolio
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 84,
            height: 84,
            borderRadius: 999,
            background: accent,
            color: onAccent,
            fontSize: 44,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{fontSize: 118, lineHeight: 1, letterSpacing: -2}}>{clamp(name, 34)}</div>
        <div style={{fontSize: 58, lineHeight: 1.15, fontStyle: 'italic', color: accent, marginTop: 18}}>
          {clamp(title, 52)}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `2px solid ${INK}22`,
          paddingTop: 26,
          fontSize: 28,
          color: MUTED,
        }}
      >
        <div>{domain}</div>
        <div>Strategy · Content · Community</div>
      </div>
    </div>,
  )
}

interface CaseStudyCardInput {
  title: string
  eyebrow?: string | null
  results: Array<{label: string; value: string}>
  coverUrl?: string | null
  authorName: string
  accentColor?: string | null
}

/** The card for a case study: title, top results and the cover image. */
export async function caseStudyCard({
  title,
  eyebrow,
  results,
  coverUrl,
  authorName,
  accentColor,
}: CaseStudyCardInput) {
  const {accent} = accentTokens(accentColor)
  const cover = await inlineImage(coverUrl)
  const hasCover = Boolean(cover)

  return render(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: PAPER_LIGHT,
        color: INK,
        fontFamily: 'Instrument Serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: hasCover ? 690 : 1200,
          padding: 64,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', fontSize: 27, color: MUTED}}>
          <div style={{width: 48, height: 2, background: accent, marginRight: 18}} />
          {clamp(eyebrow || 'Case study', 44)}
        </div>

        <div style={{display: 'flex', fontSize: title.length > 60 ? 58 : 70, lineHeight: 1.04, letterSpacing: -1}}>
          {clamp(title, 96)}
        </div>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          {results.length > 0 && (
            <div style={{display: 'flex', marginBottom: 26}}>
              {results.slice(0, 3).map((result) => (
                <div
                  key={result.label}
                  style={{display: 'flex', flexDirection: 'column', marginRight: 44}}
                >
                  <div style={{fontSize: 56, lineHeight: 1, color: accent}}>{result.value}</div>
                  <div style={{fontSize: 22, color: MUTED, marginTop: 6}}>{clamp(result.label, 22)}</div>
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              borderTop: `2px solid ${INK}22`,
              paddingTop: 20,
              fontSize: 26,
              color: MUTED,
            }}
          >
            {authorName}
          </div>
        </div>
      </div>

      {cover && (
        <div style={{display: 'flex', width: 510, height: 630, padding: 28, paddingLeft: 0}}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not shown as HTML */}
          <img
            src={cover}
            alt=""
            width={482}
            height={574}
            style={{width: 482, height: 574, objectFit: 'cover', borderRadius: 36}}
          />
        </div>
      )}
    </div>,
  )
}
