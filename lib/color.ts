import {DEFAULT_ACCENT} from '@/sanity/lib/constants'

/**
 * Colour maths for the CMS-driven accent. Given any hex colour, this works out
 * readable companion colours so the site always meets WCAG AA contrast.
 */

type Rgb = [number, number, number]

export const PAPER_LIGHT = '#FAF8F4'
export const PAPER_DARK = '#0F0E0D'
const INK = '#151311'
const WHITE = '#FFFFFF'
const BLACK = '#000000'

const AA_NORMAL_TEXT = 4.5
const AA_LARGE_TEXT = 3

export function parseHex(value: string | null | undefined): Rgb | null {
  if (!value) return null
  const match = /^#?([0-9a-f]{6})$/i.exec(value.trim())
  if (!match) return null
  const int = parseInt(match[1], 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

export function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b]
    .map((channel) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

/** Relative luminance, per WCAG 2.x. */
export function luminance([r, g, b]: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const s = channel / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

/** WCAG contrast ratio between two colours (1 to 21). */
export function contrastRatio(a: string, b: string): number {
  const rgbA = parseHex(a)
  const rgbB = parseHex(b)
  if (!rgbA || !rgbB) return 1
  const [lighter, darker] = [luminance(rgbA), luminance(rgbB)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

function mix(from: Rgb, to: Rgb, amount: number): Rgb {
  return [0, 1, 2].map((i) => from[i] + (to[i] - from[i]) * amount) as Rgb
}

/** The most readable text colour to place on top of `background`. */
export function readableOn(background: string): string {
  const withInk = contrastRatio(background, INK)
  const withWhite = contrastRatio(background, WHITE)
  if (withInk >= AA_NORMAL_TEXT && withInk >= withWhite) return INK
  if (withWhite >= AA_NORMAL_TEXT) return WHITE
  if (withInk >= AA_NORMAL_TEXT) return INK
  // Mid-tones: pure black or white always reaches at least 4.5:1 on one side.
  return contrastRatio(background, BLACK) >= withWhite ? BLACK : WHITE
}

/**
 * Nudges `color` towards black or white until it reaches `target` contrast on
 * `background`. Used so small accent-coloured text stays legible.
 */
export function ensureContrast(color: string, background: string, target = AA_NORMAL_TEXT): string {
  const rgb = parseHex(color)
  const bg = parseHex(background)
  if (!rgb || !bg) return color
  if (contrastRatio(color, background) >= target) return toHex(rgb)

  const towards: Rgb = luminance(bg) > 0.5 ? [0, 0, 0] : [255, 255, 255]
  for (let step = 1; step <= 40; step++) {
    const candidate = toHex(mix(rgb, towards, step / 40))
    if (contrastRatio(candidate, background) >= target) return candidate
  }
  return toHex(towards)
}

export interface AccentTokens {
  accent: string
  onAccent: string
  accentInkLight: string
  accentInkDark: string
  /** The accent, adjusted only if needed, for display-size text (3:1). */
  accentDisplayLight: string
  accentDisplayDark: string
}

export function accentTokens(input: string | null | undefined): AccentTokens {
  const rgb = parseHex(input) ?? (parseHex(DEFAULT_ACCENT) as Rgb)
  const accent = toHex(rgb)
  return {
    accent,
    onAccent: readableOn(accent),
    accentInkLight: ensureContrast(accent, PAPER_LIGHT),
    accentInkDark: ensureContrast(accent, PAPER_DARK),
    accentDisplayLight: ensureContrast(accent, PAPER_LIGHT, AA_LARGE_TEXT),
    accentDisplayDark: ensureContrast(accent, PAPER_DARK, AA_LARGE_TEXT),
  }
}

/**
 * The CSS that feeds the accent into the design tokens for both themes.
 * `html:root` is slightly more specific than the defaults in globals.css, so
 * these values win regardless of stylesheet order.
 */
export function accentCss(tokens: AccentTokens): string {
  return [
    `html:root{--accent:${tokens.accent};--on-accent:${tokens.onAccent};--accent-ink:${tokens.accentInkLight};--accent-display:${tokens.accentDisplayLight}}`,
    `html:root[data-theme="dark"]{--accent-ink:${tokens.accentInkDark};--accent-display:${tokens.accentDisplayDark}}`,
    `@media (prefers-color-scheme:dark){html:root:not([data-theme="light"]){--accent-ink:${tokens.accentInkDark};--accent-display:${tokens.accentDisplayDark}}}`,
  ].join('')
}
