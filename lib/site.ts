import type {SiteSettings} from '@/sanity/lib/data'

/**
 * Main navigation. The site is one page: each link scrolls to a section
 * (`id` is the section's anchor). Labels are structural, so they live in code.
 */
export const NAV_LINKS = [
  {id: 'work', href: '/#work', label: 'Work'},
  {id: 'about', href: '/#about', label: 'About'},
  {id: 'contact', href: '/#contact', label: 'Contact'},
] as const

/** Addresses of the former standalone pages, mapped to their sections. */
const SECTION_FOR_PATH: Record<string, string> = {
  '/work': '/#work',
  '/about': '/#about',
  '/contact': '/#contact',
}

/**
 * Normalises a link typed into the CMS (e.g. a hero button): "/work" and
 * "#work" both become "/#work", which scrolls on the home page and navigates
 * from any other page. Everything else is returned unchanged.
 */
export function resolveCmsHref(href: string): string {
  const trimmed = href.trim()
  if (trimmed.startsWith('#')) return `/${trimmed}`
  const path = trimmed.replace(/\/+$/, '') || '/'
  return SECTION_FOR_PATH[path] ?? trimmed
}

/** Sensible text for when a field has not been filled in yet. */
export const FALLBACKS = {
  name: 'Portfolio',
  title: 'Social Media & Community Manager',
  description:
    'Social media and community management portfolio: strategy, content and results across Instagram, TikTok, LinkedIn and Facebook.',
} as const

export function siteName(settings: SiteSettings | null): string {
  return settings?.name?.trim() || FALLBACKS.name
}

export function siteTitle(settings: SiteSettings | null): string {
  return settings?.title?.trim() || FALLBACKS.title
}

export function siteDescription(settings: SiteSettings | null): string {
  return settings?.seo?.description?.trim() || FALLBACKS.description
}

/**
 * Runs before the page paints so the right theme is applied without a flash:
 * a saved choice wins, otherwise the system setting is used.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`
