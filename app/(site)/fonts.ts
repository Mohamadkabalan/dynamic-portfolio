import {Geist_Mono, Hanken_Grotesk, Instrument_Serif} from 'next/font/google'

/**
 * Fonts are downloaded at build time and served from this site (no requests to
 * Google from visitors' browsers). See docs/design.md for how each is used.
 */

/** Display — headlines at magazine scale; the italic is the "highlight" voice. */
export const displayFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display-face',
  display: 'swap',
})

/** Text / UI — body copy, buttons, navigation. */
export const textFont = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-text-face',
  display: 'swap',
})

/** Labels — eyebrows, metric labels and metadata. */
export const labelFont = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-label-face',
  display: 'swap',
  preload: false,
})

export const fontVariables = [
  displayFont.variable,
  textFont.variable,
  labelFont.variable,
].join(' ')
