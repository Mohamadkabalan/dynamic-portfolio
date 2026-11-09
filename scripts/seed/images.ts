/**
 * Placeholder artwork for the seed content.
 *
 * Every image is drawn locally as an SVG (abstract brand-style compositions,
 * no stock photos, no real logos) and, for photos, rendered to JPEG with
 * sharp. The drawing is seeded by the image key, so the same key always
 * produces the same file — which is what makes re-running the seed safe.
 */
import sharp from 'sharp'

type Palette = {bg: [string, string]; blobs: string[]; ink: string; pop: string}

const PALETTES = {
  lumera: {bg: ['#FBE6DC', '#F3C3B2'], blobs: ['#E9A58E', '#FFF4EC', '#D97B62'], ink: '#3A1F18', pop: '#B5533C'},
  saffron: {bg: ['#FFE9B8', '#F2B33D'], blobs: ['#D9541E', '#FFF1D6', '#7A9E4E'], ink: '#3A2618', pop: '#C2410C'},
  kitewell: {bg: ['#143A7B', '#0B1E46'], blobs: ['#2F6BFF', '#9CC2FF', '#FFC857'], ink: '#F3F6FB', pop: '#FFC857'},
  tidewater: {bg: ['#BFE3DE', '#4FA9A6'], blobs: ['#0E4D56', '#F3E9DA', '#E8A87C'], ink: '#0C2F35', pop: '#E8A87C'},
  cedar: {bg: ['#EBDAC8', '#C99B76'], blobs: ['#3B2A20', '#A9714B', '#6C8A63'], ink: '#2A1C14', pop: '#6C8A63'},
  maison: {bg: ['#EFE9E1', '#D8C7B8'], blobs: ['#111111', '#B79A7B', '#F8F4EE'], ink: '#111111', pop: '#B79A7B'},
  pulse: {bg: ['#E6DBFF', '#B79CF2'], blobs: ['#6C4AB6', '#F4B6C2', '#FFE8D6'], ink: '#2D2A4A', pop: '#F4B6C2'},
  olive: {bg: ['#F5EFD9', '#D9C36A'], blobs: ['#5C6B2E', '#B4472E', '#FFF8E1'], ink: '#2F3618', pop: '#B4472E'},
  studio: {bg: ['#FAF8F4', '#EADFD2'], blobs: ['#F0502D', '#F7B9A3', '#151311'], ink: '#151311', pop: '#F0502D'},
} satisfies Record<string, Palette>

export type PaletteName = keyof typeof PALETTES

type Kind = 'scene' | 'person' | 'wordmark' | 'badge' | 'icon'

export interface ImageSpec {
  key: string
  kind: Kind
  palette: PaletteName
  width: number
  height: number
  /** Text for wordmarks and badges. */
  text?: string
}

/** Small deterministic random number generator, seeded from a string. */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let state = h >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const round = (value: number) => Math.round(value * 10) / 10

/** Makes text safe to place inside SVG/XML (e.g. the "&" in a brand name). */
const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** A soft gradient backdrop with blurred colour fields and a few crisp shapes. */
function sceneSvg({key, palette: name, width: w, height: h}: ImageSpec): string {
  const p: Palette = PALETTES[name]
  const random = seededRandom(key)
  const unit = Math.min(w, h)
  const pick = <T,>(items: T[]) => items[Math.floor(random() * items.length)]

  const blobs = Array.from({length: 4}, (_, index) => {
    const cx = round(random() * w)
    const cy = round(random() * h)
    const r = round(unit * (0.28 + random() * 0.3))
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.blobs[index % p.blobs.length]}" opacity="${round(0.45 + random() * 0.35)}"/>`
  }).join('')

  const shapes: string[] = []
  const variant = Math.floor(random() * 4)
  const cx = w * (0.35 + random() * 0.3)
  const cy = h * (0.38 + random() * 0.24)

  if (variant === 0) {
    // Arch + sun
    const aw = unit * 0.44
    const ah = unit * 0.62
    shapes.push(
      `<path d="M${round(cx - aw / 2)} ${round(cy + ah / 2)} V${round(cy - ah / 2 + aw / 2)} a${round(aw / 2)} ${round(aw / 2)} 0 0 1 ${round(aw)} 0 V${round(cy + ah / 2)} Z" fill="${p.ink}" opacity="0.92"/>`,
      `<circle cx="${round(cx + aw * 0.55)}" cy="${round(cy - ah * 0.32)}" r="${round(unit * 0.11)}" fill="${p.pop}"/>`,
    )
  } else if (variant === 1) {
    // Orbit
    shapes.push(
      `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(unit * 0.26)}" fill="${p.pop}"/>`,
      `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(unit * 0.38)}" fill="none" stroke="${p.ink}" stroke-width="${round(unit * 0.008)}" opacity="0.8"/>`,
      `<circle cx="${round(cx + unit * 0.38)}" cy="${round(cy)}" r="${round(unit * 0.045)}" fill="${p.ink}"/>`,
    )
  } else if (variant === 2) {
    // Stacked cards
    for (let i = 0; i < 3; i++) {
      const cw = unit * 0.5
      const ch = unit * 0.3
      const fill = [p.ink, p.pop, pick(p.blobs)][i]
      shapes.push(
        `<rect x="${round(cx - cw / 2 + (i - 1) * unit * 0.07)}" y="${round(cy - ch / 2 + (i - 1) * unit * 0.13)}" width="${round(cw)}" height="${round(ch)}" rx="${round(unit * 0.04)}" fill="${fill}" opacity="${i === 0 ? 0.9 : 0.96}"/>`,
      )
    }
  } else {
    // Wave bands + dot
    for (let i = 0; i < 3; i++) {
      const y = h * (0.5 + i * 0.14)
      const amp = unit * 0.07
      shapes.push(
        `<path d="M0 ${round(y)} C ${round(w * 0.25)} ${round(y - amp)}, ${round(w * 0.5)} ${round(y + amp)}, ${round(w * 0.75)} ${round(y - amp * 0.4)} S ${round(w * 1.1)} ${round(y)}, ${w} ${round(y + amp * 0.3)} V${h} H0 Z" fill="${[p.pop, p.ink, pick(p.blobs)][i]}" opacity="${[0.9, 0.88, 0.7][i]}"/>`,
      )
    }
    shapes.push(
      `<circle cx="${round(w * (0.25 + random() * 0.5))}" cy="${round(h * 0.26)}" r="${round(unit * 0.12)}" fill="${p.ink}" opacity="0.9"/>`,
    )
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient>
<filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${round(unit * 0.09)}"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<g filter="url(#b)">${blobs}</g>
${shapes.join('\n')}
</svg>`
}

/** A simple head-and-shoulders silhouette on a gradient: reads as "a person". */
function personSvg({key, palette: name, width: w, height: h}: ImageSpec): string {
  const p: Palette = PALETTES[name]
  const random = seededRandom(key)
  const unit = Math.min(w, h)
  const headR = unit * 0.17
  const cx = w / 2
  const headY = h * 0.4
  const tones = [p.ink, p.blobs[0], p.pop]
  const tone = tones[Math.floor(random() * tones.length)]
  const shoulderW = unit * 0.36
  const shoulderTop = headY + headR * 1.25

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient>
<filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${round(unit * 0.1)}"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<g filter="url(#b)">
<circle cx="${round(w * (0.1 + random() * 0.3))}" cy="${round(h * 0.2)}" r="${round(unit * 0.35)}" fill="${p.blobs[1]}" opacity="0.8"/>
<circle cx="${round(w * (0.6 + random() * 0.3))}" cy="${round(h * 0.75)}" r="${round(unit * 0.4)}" fill="${p.blobs[2 % p.blobs.length]}" opacity="0.55"/>
</g>
<circle cx="${round(cx)}" cy="${round(headY)}" r="${round(headR)}" fill="${tone}"/>
<path d="M${round(cx - shoulderW)} ${h} C ${round(cx - shoulderW)} ${round(shoulderTop + unit * 0.02)}, ${round(cx - shoulderW * 0.45)} ${round(shoulderTop)}, ${round(cx)} ${round(shoulderTop)} S ${round(cx + shoulderW)} ${round(shoulderTop + unit * 0.02)}, ${round(cx + shoulderW)} ${h} Z" fill="${tone}"/>
</svg>`
}

/** A fictional brand wordmark, single colour on a transparent background. */
function wordmarkSvg({key, width: w, height: h, text = ''}: ImageSpec): string {
  const random = seededRandom(key)
  const serif = random() > 0.5
  const mark = Math.floor(random() * 3)
  const markSize = h * 0.5
  const markX = markSize / 2 + 4
  const cy = h / 2
  const marks = [
    `<circle cx="${markX}" cy="${cy}" r="${markSize / 2}" fill="none" stroke="#111" stroke-width="${round(h * 0.07)}"/>`,
    `<rect x="${markX - markSize / 2}" y="${cy - markSize / 2}" width="${markSize}" height="${markSize}" rx="${round(markSize * 0.28)}" fill="#111"/>`,
    `<path d="M${markX - markSize / 2} ${cy + markSize / 2} L${markX} ${cy - markSize / 2} L${markX + markSize / 2} ${cy + markSize / 2} Z" fill="#111"/>`,
  ]
  const font = serif
    ? `font-family="Georgia, 'Times New Roman', serif" font-style="${random() > 0.5 ? 'italic' : 'normal'}" font-weight="400"`
    : `font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="700" letter-spacing="${random() > 0.5 ? 3 : 0}"`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${marks[mark]}
<text x="${round(markSize + 20)}" y="${round(cy)}" dominant-baseline="central" font-size="${round(h * 0.46)}" fill="#111" ${font}>${escapeXml(serif ? text : text.toUpperCase())}</text>
</svg>`
}

/** A round "seal" for certifications. */
function badgeSvg({palette: name, width: w, text = ''}: ImageSpec): string {
  const p: Palette = PALETTES[name]
  const c = w / 2
  const points = Array.from({length: 24}, (_, i) => {
    const angle = (i / 24) * Math.PI * 2
    const r = i % 2 === 0 ? c * 0.98 : c * 0.9
    return `${round(c + Math.cos(angle) * r)},${round(c + Math.sin(angle) * r)}`
  }).join(' ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" viewBox="0 0 ${w} ${w}">
<polygon points="${points}" fill="${p.pop}"/>
<circle cx="${c}" cy="${c}" r="${round(c * 0.74)}" fill="none" stroke="#FFFFFF" stroke-width="${round(w * 0.012)}" opacity="0.9"/>
<path d="M${round(c * 0.66)} ${round(c * 1.02)} l${round(c * 0.22)} ${round(c * 0.22)} l${round(c * 0.46)} ${round(-c * 0.5)}" fill="none" stroke="#FFFFFF" stroke-width="${round(w * 0.06)}" stroke-linecap="round" stroke-linejoin="round"/>
<title>${escapeXml(text)}</title>
</svg>`
}

/** The square mark used for the browser tab icon. */
function iconSvg({width: w}: ImageSpec): string {
  const c = w / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" viewBox="0 0 ${w} ${w}">
<rect width="${w}" height="${w}" rx="${round(w * 0.25)}" fill="#151311"/>
<circle cx="${c}" cy="${c}" r="${round(w * 0.235)}" fill="none" stroke="#F0502D" stroke-width="${round(w * 0.078)}"/>
<circle cx="${c}" cy="${c}" r="${round(w * 0.078)}" fill="#FAF8F4"/>
</svg>`
}

export interface RenderedImage {
  key: string
  filename: string
  contentType: 'image/jpeg' | 'image/png' | 'image/svg+xml'
  buffer: Buffer
  width: number
  height: number
}

export async function renderImage(spec: ImageSpec): Promise<RenderedImage> {
  const base = {key: spec.key, width: spec.width, height: spec.height}

  if (spec.kind === 'wordmark' || spec.kind === 'badge') {
    const svg = spec.kind === 'wordmark' ? wordmarkSvg(spec) : badgeSvg(spec)
    return {
      ...base,
      filename: `${spec.key}.svg`,
      contentType: 'image/svg+xml',
      buffer: Buffer.from(svg, 'utf8'),
    }
  }

  if (spec.kind === 'icon') {
    return {
      ...base,
      filename: `${spec.key}.png`,
      contentType: 'image/png',
      buffer: await sharp(Buffer.from(iconSvg(spec))).png({compressionLevel: 9}).toBuffer(),
    }
  }

  const svg = spec.kind === 'person' ? personSvg(spec) : sceneSvg(spec)
  return {
    ...base,
    filename: `${spec.key}.jpg`,
    contentType: 'image/jpeg',
    buffer: await sharp(Buffer.from(svg)).jpeg({quality: 82, mozjpeg: true}).toBuffer(),
  }
}
