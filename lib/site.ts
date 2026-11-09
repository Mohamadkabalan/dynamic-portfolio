import type {SiteSettings} from '@/sanity/lib/data'

/** Main navigation. Labels are structural, so they live in code rather than the CMS. */
export const NAV_LINKS = [
  {href: '/work', label: 'Work'},
  {href: '/about', label: 'About'},
  {href: '/contact', label: 'Contact'},
] as const

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
