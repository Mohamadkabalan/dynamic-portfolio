# Design system — "Editorial meets the feed"

A magazine-scale, paper-and-ink layout that frames social work the way it lives
on a phone. Calm, premium neutrals; one confident accent; work does the talking.

Everything below is implemented as CSS variables / Tailwind theme tokens in
`app/(site)/globals.css`. Components must use these tokens — no one-off values.

## 1. Palette

Neutrals are warm, never pure grey. The accent is the only saturated colour.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--paper` | `#FAF8F4` | `#0F0E0D` | Page background |
| `--paper-2` | `#F2EEE7` | `#181715` | Alternate band, inset surfaces |
| `--card` | `#FFFFFF` | `#1D1B19` | Cards, dialogs, form fields |
| `--ink` | `#151311` | `#F4F1EA` | Headings, body text |
| `--ink-2` | `#5C574F` | `#B8B2A7` | Secondary text (≥ 6:1 on paper) |
| `--ink-3` | `#6F6961` | `#958F84` | Labels, captions (≥ 4.5:1 on paper) |
| `--line` | `ink @ 12%` | `ink @ 14%` | Hairlines, borders |
| `--line-strong` | `ink @ 22%` | `ink @ 26%` | Input borders, emphasised dividers |
| `--inverse` / `--on-inverse` | `#151311` / `#FAF8F4` | `#F4F1EA` / `#0F0E0D` | Inverted bands (stats) |

### Accent (comes from the CMS)

Default: **Vermilion `#F0502D`** — the classic editorial masthead red-orange. It
reads as energetic and human next to warm paper, holds up in dark mode, and
photographs well beside social imagery.

The editor can change it in *Site settings → Look & feel*. `lib/color.ts`
derives everything else at render time, so any colour stays accessible:

| Token | How it is derived | Use |
| --- | --- | --- |
| `--accent` | The CMS value | Button fills, highlights, rings, large display text |
| `--on-accent` | Ink, white or black — whichever reaches **4.5:1** on the accent | Text/icons on accent fills |
| `--accent-ink` | Accent darkened (light mode) or lightened (dark mode) until it reaches **4.5:1** on `--paper` | Small accent text and links |
| `--accent-soft` | Accent at 12% over paper | Tinted chips, hover washes |

Rule: `--accent` may colour text only at display sizes (≥ 24px). Anything
smaller uses `--accent-ink`.

## 2. Typography

| Role | Family (Google Fonts via `next/font`) | Notes |
| --- | --- | --- |
| Display | **Instrument Serif** 400 + italic | Headlines at magazine scale. The italic is the "highlight" voice. |
| Text / UI | **Hanken Grotesk** variable | Body copy, buttons, navigation. |
| Label | **Geist Mono** variable | Eyebrows, metrics labels, metadata. Uppercase, tracked. |

Fluid scale (mobile → desktop):

| Token | Size | Line height | Tracking |
| --- | --- | --- | --- |
| `text-display-xl` (hero) | `clamp(3rem, 1.6rem + 7vw, 7.5rem)` | 0.95 | −0.02em |
| `text-display-lg` (section) | `clamp(2.375rem, 1.5rem + 4.4vw, 5rem)` | 1.0 | −0.018em |
| `text-display-md` | `clamp(1.875rem, 1.4rem + 2.2vw, 3.25rem)` | 1.05 | −0.015em |
| `text-display-sm` | `clamp(1.5rem, 1.3rem + 1vw, 2rem)` | 1.15 | −0.01em |
| `text-lead` | `clamp(1.0625rem, 1rem + 0.4vw, 1.3125rem)` | 1.55 | 0 |
| body | `1rem` (16px minimum everywhere) | 1.65 | 0 |
| small | `0.875rem` | 1.5 | 0 |
| `text-label` | `0.75rem` mono, uppercase | 1.3 | 0.09em |

Measure: body copy is capped at ~68 characters (`max-w-prose-editorial`).

## 3. Spacing & layout

- 4px base unit; use the Tailwind spacing scale.
- Container: max width `80rem`, gutters `clamp(1.25rem, 4vw, 3rem)`.
- Section rhythm: `clamp(4.5rem, 10vw, 9rem)` vertical padding.
- 12-column grid at ≥ 1024px; a single column on phones. Mobile first: every
  layout is designed for a 360–430px viewport and enhanced upwards.
- Hairline rules (`--line`) separate sections instead of heavy boxes.
- Touch targets ≥ 44 × 44px.
- One page: the menu scrolls to `#work`, `#about` and `#contact` and highlights
  the section in view. `scroll-padding-top` keeps anchors clear of the sticky
  header; smooth scrolling is only on without reduced motion. Case studies keep
  their own pages at `/work/[slug]`; the old `/work`, `/about` and `/contact`
  addresses redirect to the sections.

## 4. Radii, borders, elevation

| Token | Value | Use |
| --- | --- | --- |
| `rounded-sm` | 8px | Inputs, small chips |
| `rounded-md` | 14px | Feed tiles, small cards |
| `rounded-lg` | 22px | Cards, images |
| `rounded-xl` | 32px | Feature panels, CTA band |
| `rounded-phone` | 2.75rem | Phone-frame mockups |
| `rounded-full` | 999px | Buttons, pills, avatars |

Elevation is used sparingly: `shadow-soft` (cards on hover, floating chips) and
`shadow-lift` (dialogs, phone frames). Flat + hairline is the default.

## 5. Motion

Motion should feel like a page turning, never like a loading spinner.

- **Easing:** `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` for entrances;
  `ease-in-out` only for looping motion.
- **Durations:** 150–200ms micro-interactions · 500–700ms reveals · 300ms page
  transition · 1.6s count-up.
- **Scroll reveals:** fade + 24px rise, once, when 15% visible.
- **Staggered grids:** children follow at 60–80ms intervals (max ~8 steps).
- **Logo marquee:** infinite, linear, ~40s per loop; pauses on hover and focus.
- **Count-up numbers:** run once when scrolled into view; tabular numerals so
  the layout never shifts.
- **Video previews:** play on hover/focus (desktop) or tap (touch); never
  auto-play with sound; always have a poster and `preload="none"`.
- **Page transitions:** a short fade/rise on the page content.
- **Above the fold** content never waits for JavaScript to become visible
  (hero entrance is CSS-only).

### Reduced motion

With `prefers-reduced-motion: reduce`: no transforms or parallax, the marquee
becomes a static wrapped row, numbers render at their final value, story
progress does not auto-advance, videos never play automatically, and page
transitions are disabled. Opacity-only fades ≤ 200ms are allowed.

## 6. Accessibility

- WCAG 2.1 AA contrast for all text, including on the CMS accent.
- Visible focus: a 2px `--ink` ring with a 2px `--paper` offset on every
  interactive element (`:focus-visible`).
- Full keyboard support: skip link, focus-trapped dialogs with Escape, arrow
  keys in the lightbox and testimonial "stories", roving tab order in filters.
- Every image has alt text (required in the CMS). Decorative imagery is hidden
  from assistive technology.
- Light and dark themes: follows the system setting, with a manual toggle that
  is remembered.

## 7. Components

**Primitives** — `Container`, `Section`, `SectionHeading`, `Eyebrow`, `Button`
(primary / secondary / ghost), `Chip`, `PlatformIcon`, `ServiceIcon`,
`SanityImage`, `RichText`.

**Motion** — `MotionProvider`, `Reveal`, `Stagger` / `StaggerItem`, `CountUp`,
`Marquee`.

**"Feed" language** — `PhoneFrame` (reels and stories), `FeedTile` (4:5 posts,
carousel indicator, hover-to-play), `CarouselViewer` (swipe/scroll-snap),
`FeedLightbox` (media + caption + metrics), `StoryAvatar` (gradient story ring),
`StatChip` (floating hero badges).

**Sections** — `Hero`, `LogoMarquee`, `StatsBand`, `FeaturedWork`,
`FeedSection`, `ServicesSection`, `TestimonialStories`, `ToolsSection`,
`LanguagesSection` (About page: language, proficiency label and a decorative
five-segment meter in the accent colour; the label carries the meaning),
`ContactCta`.

**Work** — `CaseStudyCard`, `WorkFilter`, `MetricCard`, `Gallery`,
`AtAGlance`, `CaseStudyPager`.

**Shell** — `Header` (nav, availability, theme toggle, mobile menu), `Footer`,
`SkipLink`, `SetupNotice`.

**Forms** — `ContactForm` (Netlify Forms, honeypot, success/error states).
