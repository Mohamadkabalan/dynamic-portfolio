/**
 * Shared option lists used by both the Studio schemas and the website.
 * Keep the `value`s stable: they are stored in the content.
 */

export const PLATFORMS = [
  {title: 'Instagram', value: 'instagram'},
  {title: 'TikTok', value: 'tiktok'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'X', value: 'x'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'Pinterest', value: 'pinterest'},
  {title: 'Threads', value: 'threads'},
] as const

export type PlatformValue = (typeof PLATFORMS)[number]['value']

export const PLATFORM_TITLES: Record<string, string> = Object.fromEntries(
  PLATFORMS.map((platform) => [platform.value, platform.title]),
)

export const CONTENT_TYPES = [
  {title: 'Post (single image)', value: 'post'},
  {title: 'Carousel (swipeable images)', value: 'carousel'},
  {title: 'Reel / short video', value: 'reel'},
  {title: 'Story', value: 'story'},
] as const

export type ContentTypeValue = (typeof CONTENT_TYPES)[number]['value']

export const TOOL_CATEGORIES = [
  {title: 'Scheduling', value: 'scheduling'},
  {title: 'Design', value: 'design'},
  {title: 'Analytics', value: 'analytics'},
  {title: 'Ads', value: 'ads'},
  {title: 'Video', value: 'video'},
] as const

export const TOOL_CATEGORY_TITLES: Record<string, string> = Object.fromEntries(
  TOOL_CATEGORIES.map((category) => [category.value, category.title]),
)

/**
 * Spoken-language proficiency, strongest first. `score` is how many of the
 * five segments of the meter on the About page are filled in.
 */
export const LANGUAGE_LEVELS = [
  {title: 'Native or bilingual', value: 'native', score: 5},
  {title: 'Fluent', value: 'fluent', score: 4},
  {title: 'Professional working proficiency', value: 'professional', score: 3},
  {title: 'Conversational', value: 'conversational', score: 2},
  {title: 'Basic', value: 'basic', score: 1},
] as const

export type LanguageLevelValue = (typeof LANGUAGE_LEVELS)[number]['value']

export const LANGUAGE_LEVEL_MAX = 5

export const LANGUAGE_LEVEL_TITLES: Record<string, string> = Object.fromEntries(
  LANGUAGE_LEVELS.map((level) => [level.value, level.title]),
)

export const LANGUAGE_LEVEL_SCORES: Record<string, number> = Object.fromEntries(
  LANGUAGE_LEVELS.map((level) => [level.value, level.score]),
)

/** Homepage sections the editor can reorder and hide. The hero always comes first. */
export const HOME_SECTIONS = [
  {title: 'Client logos', value: 'logos'},
  {title: 'Stats ("by the numbers")', value: 'stats'},
  {title: 'Featured case studies', value: 'featuredWork'},
  {title: 'Content feed', value: 'feed'},
  {title: 'Services', value: 'services'},
  {title: 'Testimonials', value: 'testimonials'},
  {title: 'Tools', value: 'tools'},
  {title: 'Contact call-to-action', value: 'contactCta'},
] as const

export type HomeSectionValue = (typeof HOME_SECTIONS)[number]['value']

export const HOME_SECTION_TITLES: Record<string, string> = Object.fromEntries(
  HOME_SECTIONS.map((section) => [section.value, section.title]),
)

/**
 * Icons an editor can choose for a service. Each `value` is a lucide icon name
 * that is mapped to a component in `components/ui/ServiceIcon.tsx`.
 */
export const SERVICE_ICONS = [
  {title: 'Megaphone — campaigns', value: 'megaphone'},
  {title: 'Calendar — content planning', value: 'calendar-days'},
  {title: 'Pen — copywriting', value: 'pen-tool'},
  {title: 'Camera — photography', value: 'camera'},
  {title: 'Clapperboard — video & reels', value: 'clapperboard'},
  {title: 'Chart — analytics & reporting', value: 'chart-column'},
  {title: 'Trending up — growth', value: 'trending-up'},
  {title: 'People — community', value: 'users-round'},
  {title: 'Speech bubbles — engagement', value: 'messages-square'},
  {title: 'Target — paid ads', value: 'target'},
  {title: 'Sparkles — branding', value: 'sparkles'},
  {title: 'Palette — design', value: 'palette'},
  {title: 'Handshake — partnerships & influencers', value: 'handshake'},
  {title: 'Lightbulb — strategy', value: 'lightbulb'},
  {title: 'Rocket — launches', value: 'rocket'},
  {title: 'Compass — audits', value: 'compass'},
  {title: 'Presentation — workshops', value: 'presentation'},
  {title: 'Heart — brand love', value: 'heart'},
] as const

export type ServiceIconValue = (typeof SERVICE_ICONS)[number]['value']

/** IDs of the one-of-a-kind documents (singletons). */
export const SINGLETON_IDS = {
  siteSettings: 'siteSettings',
  homePage: 'homePage',
  aboutPage: 'aboutPage',
} as const

export const SINGLETON_TYPES: ReadonlySet<string> = new Set(Object.keys(SINGLETON_IDS))

/** Collections that support drag-and-drop ordering in the Studio. */
export const ORDERABLE_TYPES = [
  'caseStudy',
  'contentPiece',
  'service',
  'testimonial',
  'client',
  'stat',
  'tool',
  'certification',
] as const

/** The accent colour used until the editor chooses one in Site settings. */
export const DEFAULT_ACCENT = '#F0502D'
