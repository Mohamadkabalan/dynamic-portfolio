/**
 * The sample content written by `npm run seed`.
 *
 * Everything here is placeholder material so the site looks complete on day
 * one: the brands, people, numbers, employers and certifications are all
 * FICTIONAL and should be replaced with real content in the Studio.
 *
 * Every document has a fixed `_id`, so running the seed again replaces the
 * same documents instead of creating duplicates.
 */
import type {ImageSpec, PaletteName} from './images'

/* ------------------------------- helpers -------------------------------- */

export interface SeedDocument {
  _id: string
  _type: string
  [field: string]: unknown
}

export interface SeedImage {
  _type: 'image'
  asset: {_type: 'reference'; _ref: string}
  alt: string
}

/** Turns an image key into a Sanity image reference (provided by the caller). */
export type ImageResolver = (key: string, alt: string) => SeedImage

const ref = (id: string) => ({_type: 'reference' as const, _ref: id})

/** Plain paragraphs → Portable Text blocks with stable keys. */
function paragraphs(prefix: string, texts: string[]) {
  return texts.map((text, index) => ({
    _type: 'block',
    _key: `${prefix}-p${index}`,
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: `${prefix}-p${index}-s`, text, marks: []}],
  }))
}

function heading(key: string, text: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'h3',
    markDefs: [],
    children: [{_type: 'span', _key: `${key}-s`, text, marks: []}],
  }
}

function bullets(prefix: string, items: string[]) {
  return items.map((text, index) => ({
    _type: 'block',
    _key: `${prefix}-b${index}`,
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{_type: 'span', _key: `${prefix}-b${index}-s`, text, marks: []}],
  }))
}

/* -------------------------------- images -------------------------------- */

const scene = (key: string, palette: PaletteName, width: number, height: number): ImageSpec => ({
  key,
  kind: 'scene',
  palette,
  width,
  height,
})
const person = (key: string, palette: PaletteName, width = 480, height = 480): ImageSpec => ({
  key,
  kind: 'person',
  palette,
  width,
  height,
})
const wordmark = (key: string, text: string): ImageSpec => ({
  key,
  kind: 'wordmark',
  palette: 'studio',
  width: Math.round(110 + text.length * 30),
  height: 80,
  text,
})

const COVER = [2400, 1500] as const
const POST = [1080, 1350] as const
const VERTICAL = [1080, 1920] as const
const WIDE = [1800, 1200] as const

interface ClientSeed {
  id: string
  name: string
  palette: PaletteName
  website: string
}

/** Eight fictional brands. */
const CLIENTS: ClientSeed[] = [
  {id: 'lumera', name: 'Luméra Skin', palette: 'lumera', website: 'https://example.com/lumera'},
  {id: 'saffron', name: 'Saffron & Salt Kitchen', palette: 'saffron', website: 'https://example.com/saffron-salt'},
  {id: 'kitewell', name: 'Kitewell Pay', palette: 'kitewell', website: 'https://example.com/kitewell'},
  {id: 'tidewater', name: 'Tidewater House Hotels', palette: 'tidewater', website: 'https://example.com/tidewater'},
  {id: 'cedar', name: 'Cedar Line Roasters', palette: 'cedar', website: 'https://example.com/cedar-line'},
  {id: 'maison', name: 'Maison Nour', palette: 'maison', website: 'https://example.com/maison-nour'},
  {id: 'pulse', name: 'Pulse & Plank Studio', palette: 'pulse', website: 'https://example.com/pulse-plank'},
  {id: 'olive', name: 'Olive Row Market', palette: 'olive', website: 'https://example.com/olive-row'},
]

export const IMAGE_SPECS: ImageSpec[] = [
  {key: 'favicon', kind: 'icon', palette: 'studio', width: 512, height: 512},
  person('hero', 'studio', VERTICAL[0], VERTICAL[1]),
  person('portrait', 'studio', 1200, 1500),
  ...CLIENTS.map((client) => wordmark(`logo-${client.id}`, client.name)),
  // Case study covers + galleries
  ...(['lumera', 'saffron', 'kitewell', 'tidewater'] as const).flatMap((id) => [
    scene(`cover-${id}`, id, COVER[0], COVER[1]),
    scene(`gallery-${id}-1`, id, POST[0], POST[1]),
    scene(`gallery-${id}-2`, id, WIDE[0], WIDE[1]),
    scene(`gallery-${id}-3`, id, 1200, 1200),
    scene(`figure-${id}`, id, WIDE[0], WIDE[1]),
  ]),
  // Feed
  scene('feed-01', 'lumera', VERTICAL[0], VERTICAL[1]),
  scene('feed-02-a', 'lumera', POST[0], POST[1]),
  scene('feed-02-b', 'lumera', POST[0], POST[1]),
  scene('feed-02-c', 'lumera', POST[0], POST[1]),
  scene('feed-03', 'saffron', POST[0], POST[1]),
  scene('feed-04', 'saffron', VERTICAL[0], VERTICAL[1]),
  scene('feed-05-a', 'kitewell', POST[0], POST[1]),
  scene('feed-05-b', 'kitewell', POST[0], POST[1]),
  scene('feed-05-c', 'kitewell', POST[0], POST[1]),
  scene('feed-05-d', 'kitewell', POST[0], POST[1]),
  scene('feed-06', 'kitewell', POST[0], POST[1]),
  scene('feed-07', 'tidewater', VERTICAL[0], VERTICAL[1]),
  scene('feed-08', 'tidewater', POST[0], POST[1]),
  scene('feed-09', 'cedar', VERTICAL[0], VERTICAL[1]),
  scene('feed-10-a', 'maison', POST[0], POST[1]),
  scene('feed-10-b', 'maison', POST[0], POST[1]),
  scene('feed-10-c', 'maison', POST[0], POST[1]),
  scene('feed-11', 'pulse', VERTICAL[0], VERTICAL[1]),
  scene('feed-12', 'olive', POST[0], POST[1]),
  // People
  person('avatar-1', 'lumera'),
  person('avatar-2', 'saffron'),
  person('avatar-3', 'kitewell'),
  person('avatar-4', 'tidewater'),
  person('avatar-5', 'cedar'),
  person('avatar-6', 'pulse'),
  // Certifications
  {key: 'badge-1', kind: 'badge', palette: 'studio', width: 400, height: 400, text: 'Advanced Community Management'},
  {key: 'badge-2', kind: 'badge', palette: 'kitewell', width: 400, height: 400, text: 'Paid Social Strategy'},
]

/* ------------------------------ documents ------------------------------- */

export function buildDocuments(image: ImageResolver): SeedDocument[] {
  /* Settings */
  const siteSettings: SeedDocument = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'Sukaina Charaf Eddine',
    title: 'Social Media & Community Manager',
    favicon: image('favicon', 'Site icon'),
    accentColor: '#F0502D',
    socialLinks: [
      {_key: 'instagram', _type: 'socialLink', platform: 'instagram', url: 'https://www.instagram.com/yourhandle', handle: '@yourhandle', followerCount: '18.4K'},
      {_key: 'tiktok', _type: 'socialLink', platform: 'tiktok', url: 'https://www.tiktok.com/@yourhandle', handle: '@yourhandle', followerCount: '42.1K'},
      {_key: 'linkedin', _type: 'socialLink', platform: 'linkedin', url: 'https://www.linkedin.com/in/yourhandle', handle: 'in/yourhandle', followerCount: '9.7K'},
      {_key: 'facebook', _type: 'socialLink', platform: 'facebook', url: 'https://www.facebook.com/yourhandle', handle: 'yourhandle', followerCount: '6.2K'},
    ],
    availability: {isAvailable: true, text: 'Booking new clients for next quarter'},
    contactEmail: 'hello@example.com',
    location: 'Working with brands worldwide',
    workPage: {
      heading: 'Work that earns the scroll-stop.',
      intro:
        'Strategy, content and community management for brands that want more than vanity metrics. Filter by platform or industry.',
    },
    contactPage: {
      heading: 'Let’s build something people talk about.',
      intro:
        'Share a few details about your brand and goals. I read every message and reply within two working days.',
      budgetOptions: [
        'Under $1,000 / month',
        '$1,000 – $2,500 / month',
        '$2,500 – $5,000 / month',
        '$5,000+ / month',
        'One-off project',
        'Not sure yet',
      ],
      successMessage: 'Thank you! I will get back to you within two working days.',
    },
    seo: {
      titleTemplate: '%s · Sukaina Charaf Eddine',
      description:
        'Sukaina Charaf Eddine is a social media and community manager helping brands grow engaged audiences on Instagram, TikTok, LinkedIn and Facebook.',
    },
    footerText: 'Let’s make your brand impossible to scroll past.',
  }

  /* Home */
  const homePage: SeedDocument = {
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      eyebrow: 'Social Media & Community Manager',
      headline: 'I turn scrolling into community.',
      highlight: 'community',
      subheadline:
        'Strategy, content and day-to-day community management for brands on Instagram, TikTok, LinkedIn and Facebook — built to earn attention and keep it.',
      primaryCta: {_type: 'cta', label: 'See the work', href: '/work'},
      secondaryCta: {_type: 'cta', label: 'Start a project', href: '/contact'},
      mediaType: 'image',
      image: image('hero', 'Portrait of Sukaina against a warm backdrop'),
      statChips: [
        {_key: 'chip-1', _type: 'statChip', value: '4.2M', label: 'views generated'},
        {_key: 'chip-2', _type: 'statChip', value: '+312%', label: 'follower growth'},
        {_key: 'chip-3', _type: 'statChip', value: '6.8%', label: 'avg. engagement'},
      ],
    },
    sections: [
      {_key: 'logos', _type: 'homeSection', section: 'logos', enabled: true, heading: 'Trusted by brands that care about community'},
      {_key: 'stats', _type: 'homeSection', section: 'stats', enabled: true, eyebrow: 'By the numbers', heading: 'Results that travel beyond the feed.'},
      {_key: 'featuredWork', _type: 'homeSection', section: 'featuredWork', enabled: true, eyebrow: 'Selected work', heading: 'Case studies', intro: 'A few projects where strategy, content and community pulled in the same direction.'},
      {_key: 'feed', _type: 'homeSection', section: 'feed', enabled: true, eyebrow: 'The feed', heading: 'Content, as it lived on the timeline.', intro: 'Posts, carousels, reels and stories — tap any piece for the caption and the numbers.'},
      {_key: 'services', _type: 'homeSection', section: 'services', enabled: true, eyebrow: 'Services', heading: 'How I can help'},
      {_key: 'testimonials', _type: 'homeSection', section: 'testimonials', enabled: true, eyebrow: 'Kind words', heading: 'What clients say'},
      {_key: 'tools', _type: 'homeSection', section: 'tools', enabled: true, eyebrow: 'Toolkit', heading: 'The tools behind the work'},
      {_key: 'contactCta', _type: 'homeSection', section: 'contactCta', enabled: true, eyebrow: 'Next step', heading: 'Have a brand that deserves a louder room?', intro: 'Tell me where you are and where you want to be. I reply within two working days.'},
    ],
  }

  /* About */
  const aboutPage: SeedDocument = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    headline: 'The person behind the posts.',
    portrait: image('portrait', 'Portrait of Sukaina Charaf Eddine'),
    bio: paragraphs('bio', [
      'I’m Sukaina — a social media and community manager who believes the best-performing content starts with listening. I help brands find their voice, show up consistently, and turn an audience into a community that talks back.',
      'My work sits where strategy meets the day-to-day: content calendars and campaign concepts on one side, comment sections, DMs and creator relationships on the other. I care about numbers, but I care more about what the numbers mean for the business.',
      'When I’m not planning a launch, you’ll find me saving references, testing new formats before the algorithm makes them mandatory, and over-analysing why a reel worked.',
    ]),
    approachHeading: 'How I work',
    approach: [
      {_key: 'step-1', _type: 'step', title: 'Listen & audit', description: 'I start with your audience, your competitors and your past content to find what is already working — and what is quietly holding you back.'},
      {_key: 'step-2', _type: 'step', title: 'Plan the story', description: 'A clear positioning, content pillars and a calendar the whole team can follow, built around moments that matter to your customers.'},
      {_key: 'step-3', _type: 'step', title: 'Create & show up', description: 'Scroll-stopping content, published consistently, with a community that gets a reply — not an auto-response.'},
      {_key: 'step-4', _type: 'step', title: 'Measure & refine', description: 'Monthly reporting in plain language: what we learned, what we are changing, and what it did for the business.'},
    ],
    experienceHeading: 'Experience',
    experience: [
      {_key: 'role-1', _type: 'role', role: 'Freelance Social Media & Community Manager', company: 'Independent', period: '2023 — Present', description: 'Partnering with beauty, hospitality, food and fintech brands on social strategy, content production and community management.'},
      {_key: 'role-2', _type: 'role', role: 'Senior Community Manager', company: 'Northlight Studio (sample)', period: '2021 — 2023', description: 'Led community and content for a portfolio of lifestyle brands, building response playbooks and creator programmes.'},
      {_key: 'role-3', _type: 'role', role: 'Social Media Executive', company: 'Harbour & Vine Agency (sample)', period: '2019 — 2021', description: 'Planned and published multi-platform content calendars and managed day-to-day engagement for retail and hospitality clients.'},
    ],
    valuesHeading: 'What I believe',
    values: [
      {_key: 'value-1', _type: 'value', title: 'Community before content', description: 'A post is a conversation starter. The real work happens in the replies, the DMs and the relationships that follow.'},
      {_key: 'value-2', _type: 'value', title: 'Consistency beats virality', description: 'One viral moment is luck. Showing up well every week is a strategy — and it compounds.'},
      {_key: 'value-3', _type: 'value', title: 'Numbers need a story', description: 'I report on what moved the business, in language anyone on the team can act on.'},
      {_key: 'value-4', _type: 'value', title: 'Brands are people', description: 'The accounts people love sound like someone. I help brands find that someone and stay in character.'},
    ],
  }

  /* Clients */
  const clients: SeedDocument[] = CLIENTS.map((client) => ({
    _id: `client-${client.id}`,
    _type: 'client',
    name: client.name,
    logo: image(`logo-${client.id}`, `${client.name} logo`),
    website: client.website,
    showInLogoWall: true,
  }))

  /* Testimonials */
  const TESTIMONIALS = [
    {id: '1', client: 'lumera', name: 'Maya Haddad', role: 'Founder', company: 'Luméra Skin', quote: 'Sukaina understood our customer better than we did. The launch sold out in three days and, more importantly, the community she built is still talking to us months later.'},
    {id: '2', client: 'saffron', name: 'Karim Nassar', role: 'Owner & Head Chef', company: 'Saffron & Salt Kitchen', quote: 'We went from posting when we remembered to having a real voice online. Tables are booked by people who say they found us on Instagram — every single week.'},
    {id: '3', client: 'kitewell', name: 'Dana Whitfield', role: 'VP Marketing', company: 'Kitewell Pay', quote: 'She made a payments company sound human. Our LinkedIn went from a press-release archive to our best source of inbound conversations.'},
    {id: '4', client: 'tidewater', name: 'Jonas Reyes', role: 'Brand Director', company: 'Tidewater House Hotels', quote: 'Calm, organised and genuinely creative. Our guests now share their stays without being asked, and direct bookings from social have never been higher.'},
    {id: '5', client: 'cedar', name: 'Lina Aziz', role: 'Marketing Lead', company: 'Cedar Line Roasters', quote: 'The reporting alone is worth it. Every month we know what worked, why, and what we are doing next — with zero jargon.'},
    {id: '6', client: 'pulse', name: 'Sofia Marin', role: 'Studio Owner', company: 'Pulse & Plank Studio', quote: 'Our members feel seen. Sukaina replies like a real person, and our classes fill faster because of it.'},
  ]
  const testimonials: SeedDocument[] = TESTIMONIALS.map((item) => ({
    _id: `testimonial-${item.id}`,
    _type: 'testimonial',
    quote: item.quote,
    name: item.name,
    role: item.role,
    company: item.company,
    avatar: image(`avatar-${item.id}`, `Portrait of ${item.name}`),
    client: ref(`client-${item.client}`),
  }))

  /* Case studies */
  const gallery = (id: string, captions: [string, string, string]) =>
    captions.map((caption, index) => ({
      ...image(`gallery-${id}-${index + 1}`, caption),
      _key: `gallery-${index + 1}`,
      _type: 'galleryImage',
      caption,
    }))

  const execution = (id: string, intro: string[], points: string[], figureAlt: string, outro: string[]) => [
    ...paragraphs(`${id}-ex-intro`, intro),
    heading(`${id}-ex-h1`, 'What we made'),
    ...bullets(`${id}-ex`, points),
    {_key: `${id}-figure`, ...image(`figure-${id}`, figureAlt), _type: 'figure', caption: figureAlt},
    ...paragraphs(`${id}-ex-outro`, outro),
  ]

  const caseStudies: SeedDocument[] = [
    {
      _id: 'caseStudy-lumera-launch',
      _type: 'caseStudy',
      title: 'How a skincare launch sold out in 72 hours on TikTok',
      slug: {_type: 'slug', current: 'lumera-skincare-tiktok-launch'},
      featured: true,
      client: ref('client-lumera'),
      industry: 'Beauty',
      platforms: ['tiktok', 'instagram'],
      timeframe: 'Jan – Mar 2025',
      cover: image('cover-lumera', 'Abstract warm-toned artwork for the Luméra Skin launch campaign'),
      summary:
        'A creator-led launch for a new barrier-repair serum: three weeks of teasing, one drop day, and a community that did the selling for us.',
      challenge: paragraphs('lumera-ch', [
        'Luméra Skin was launching its first hero product into a crowded category, with no paid media budget and an Instagram audience that liked posts but rarely bought.',
        'The brief: make the launch feel like an event, reach people who had never heard of the brand, and sell through the first production run.',
      ]),
      strategy: paragraphs('lumera-st', [
        'We treated the launch like a series, not an announcement. TikTok became the stage for the story — the formulation, the failed batches, the founder’s own skin journey — while Instagram became the place to ask questions and join the waitlist.',
        'Instead of a few large creators, we seeded forty micro-creators with early samples and one rule: say what you actually think.',
      ]),
      execution: execution(
        'lumera',
        ['Over three weeks we published a daily behind-the-formula series and replied to every comment within the hour, turning questions into the next day’s video.'],
        ['21 TikTok episodes in the “Batch 14” series', '40 micro-creator reviews, unscripted', 'A waitlist flow via Instagram stories and DMs', 'A live Q&A with the founder on launch night'],
        'Storyboard frames from the “Batch 14” TikTok series',
        ['On drop day the community was already warm: the first restock sold out before the launch-day live had ended.'],
      ),
      results: [
        {_key: 'r1', _type: 'resultMetric', label: 'Video views', value: 4.2, suffix: 'M', change: 640, timeframe: 'in 3 weeks'},
        {_key: 'r2', _type: 'resultMetric', label: 'Follower growth', value: 312, prefix: '+', suffix: '%', timeframe: 'TikTok, 90 days'},
        {_key: 'r3', _type: 'resultMetric', label: 'Hours to sell out', value: 72, timeframe: 'first production run'},
        {_key: 'r4', _type: 'resultMetric', label: 'Engagement rate', value: 6.8, suffix: '%', change: 185, timeframe: 'vs. previous quarter'},
        {_key: 'r5', _type: 'resultMetric', label: 'Waitlist sign-ups', value: 11.5, suffix: 'K'},
        {_key: 'r6', _type: 'resultMetric', label: 'Creator videos', value: 40, timeframe: 'all organic'},
      ],
      testimonial: ref('testimonial-1'),
      gallery: gallery('lumera', ['Launch-day carousel artwork', 'Campaign moodboard and colour story', 'Product texture study for the serum']),
    },
    {
      _id: 'caseStudy-saffron-table',
      _type: 'caseStudy',
      title: 'Turning a neighbourhood kitchen into the city’s most-saved table',
      slug: {_type: 'slug', current: 'saffron-salt-most-saved-table'},
      featured: true,
      client: ref('client-saffron'),
      industry: 'Food & Beverage',
      platforms: ['instagram', 'facebook'],
      timeframe: '6 months',
      cover: image('cover-saffron', 'Abstract saffron and paprika-toned artwork for Saffron & Salt Kitchen'),
      summary:
        'A content rhythm built around the kitchen’s real week — market mornings, staff meals, the Friday special — that turned saves into reservations.',
      challenge: paragraphs('saffron-ch', [
        'Saffron & Salt had loyal regulars and a quiet online presence. Posts were occasional, beautifully plated, and almost identical to every other restaurant in the city.',
        'The owner wanted fuller mid-week service without discounting.',
      ]),
      strategy: paragraphs('saffron-st', [
        'People save restaurants they plan to visit, so we optimised for saves, not likes. Every piece had to answer “why would I come here on a Tuesday?”',
        'We built four weekly pillars around the kitchen’s rhythm and gave the chef a recurring on-camera moment that people could recognise.',
      ]),
      execution: execution(
        'saffron',
        ['A two-hour shoot every Monday gave us a full week of content, and a Facebook group for regulars became the place to announce specials first.'],
        ['“Market Monday” reels filmed at the supplier', 'A weekly Friday-special carousel', 'Staff-meal stories every Wednesday', 'A regulars’ group on Facebook with early table access'],
        'Contact sheet from a Monday content shoot in the kitchen',
        ['Mid-week bookings grew steadily, and the Friday special now sells out from the carousel alone.'],
      ),
      results: [
        {_key: 'r1', _type: 'resultMetric', label: 'Post saves', value: 38, suffix: 'K', change: 420, timeframe: 'in 6 months'},
        {_key: 'r2', _type: 'resultMetric', label: 'Mid-week bookings', value: 64, prefix: '+', suffix: '%', timeframe: 'Tue – Thu'},
        {_key: 'r3', _type: 'resultMetric', label: 'Profile visits', value: 210, suffix: 'K'},
        {_key: 'r4', _type: 'resultMetric', label: 'Regulars’ group members', value: 2.4, suffix: 'K'},
      ],
      testimonial: ref('testimonial-2'),
      gallery: gallery('saffron', ['Friday special carousel cover', 'Market Monday reel thumbnails', 'Seasonal menu announcement post']),
    },
    {
      _id: 'caseStudy-kitewell-linkedin',
      _type: 'caseStudy',
      title: 'Making a fintech feel human on LinkedIn',
      slug: {_type: 'slug', current: 'kitewell-pay-human-linkedin'},
      featured: true,
      client: ref('client-kitewell'),
      industry: 'Fintech',
      platforms: ['linkedin'],
      timeframe: 'Apr – Sep 2025',
      cover: image('cover-kitewell', 'Abstract navy and electric-blue artwork for Kitewell Pay'),
      summary:
        'An employee-led LinkedIn programme that replaced product announcements with people, opinions and plain-language explainers.',
      challenge: paragraphs('kitewell-ch', [
        'Kitewell Pay’s LinkedIn page was a feed of feature releases. Reach was flat, and the sales team said prospects had never seen the brand before the first call.',
      ]),
      strategy: paragraphs('kitewell-st', [
        'B2B buyers follow people, not logos. We shifted the centre of gravity from the company page to fourteen employees, each with a clear topic they could own.',
        'The company page became the editor: curating, explaining, and turning customer questions into carousels anyone could understand.',
      ]),
      execution: execution(
        'kitewell',
        ['We ran monthly writing sessions with the advocate group and published a weekly “Payments, explained” carousel from the company page.'],
        ['14 employee advocates with personal content plans', '26 “Payments, explained” carousels', 'A comment-first engagement routine for the sales team', 'Quarterly founder essays'],
        'A “Payments, explained” carousel laid out as slides',
        ['Within two quarters LinkedIn became the top source of inbound demo requests.'],
      ),
      results: [
        {_key: 'r1', _type: 'resultMetric', label: 'Impressions', value: 1.9, suffix: 'M', change: 380, timeframe: 'in 6 months'},
        {_key: 'r2', _type: 'resultMetric', label: 'Inbound leads from LinkedIn', value: 240, prefix: '+', suffix: '%'},
        {_key: 'r3', _type: 'resultMetric', label: 'Employee advocates', value: 14},
        {_key: 'r4', _type: 'resultMetric', label: 'Page followers', value: 22, suffix: 'K', change: 96},
      ],
      testimonial: ref('testimonial-3'),
      gallery: gallery('kitewell', ['Carousel cover system', 'Advocate content calendar', 'Founder essay header artwork']),
    },
    {
      _id: 'caseStudy-tidewater-direct',
      _type: 'caseStudy',
      title: 'A boutique hotel group’s community that books direct',
      slug: {_type: 'slug', current: 'tidewater-house-books-direct'},
      featured: false,
      client: ref('client-tidewater'),
      industry: 'Hospitality',
      platforms: ['instagram', 'tiktok', 'facebook'],
      timeframe: '2024 – ongoing',
      cover: image('cover-tidewater', 'Abstract teal and sand-toned artwork for Tidewater House Hotels'),
      summary:
        'Guest-generated stories, a locals’ guide series and fast, friendly DMs that moved bookings away from third-party platforms.',
      challenge: paragraphs('tidewater-ch', [
        'Tidewater House relied on booking platforms for most reservations, paying commission on stays from guests who already followed the hotels on Instagram.',
      ]),
      strategy: paragraphs('tidewater-st', [
        'We made the social channels the best place to plan a stay: real guest stories, a weekly locals’ guide, and a concierge-style inbox that answered within minutes.',
      ]),
      execution: execution(
        'tidewater',
        ['A simple guest-content programme collected permissioned photos and clips, and every DM enquiry was handled with a direct-booking link and a personal note.'],
        ['“A Local’s Weekend” guide series on Instagram and TikTok', 'A guest-story highlight for every property', 'A 10-minute response standard for DMs', 'Seasonal offers announced to followers first'],
        'Highlight covers and story templates for the three properties',
        ['Direct bookings attributed to social now outperform any single booking platform.'],
      ),
      results: [
        {_key: 'r1', _type: 'resultMetric', label: 'Direct bookings from social', value: 58, prefix: '+', suffix: '%', timeframe: 'year on year'},
        {_key: 'r2', _type: 'resultMetric', label: 'Guest stories shared', value: 1.3, suffix: 'K'},
        {_key: 'r3', _type: 'resultMetric', label: 'Average DM response', value: 9, suffix: ' min', change: -82, timeframe: 'response time'},
      ],
      testimonial: ref('testimonial-4'),
      gallery: gallery('tidewater', ['Locals’ guide reel cover', 'Property highlight artwork', 'Seasonal offer announcement']),
    },
  ]

  /* Feed */
  const slides = (keys: string[], alts: string[]) =>
    keys.map((key, index) => ({_key: `slide-${index + 1}`, ...image(key, alts[index] ?? alts[0]), _type: 'slide'}))

  const FEED = [
    {id: '01', title: 'Luméra — “Batch 14” launch reel', type: 'reel', platform: 'tiktok', images: slides(['feed-01'], ['Cover frame of the Batch 14 launch reel']), caption: 'Fourteen batches. Thirteen “not yet”s. One serum we’re finally proud of. 🧪\n\nBatch 14 drops Friday — waitlist in bio.', metrics: {views: 1840000, likes: 212000, comments: 3400, shares: 18900, saves: 41200}, caseStudy: 'caseStudy-lumera-launch'},
    {id: '02', title: 'Luméra — barrier repair, explained (carousel)', type: 'carousel', platform: 'instagram', images: slides(['feed-02-a', 'feed-02-b', 'feed-02-c'], ['Carousel cover: your skin barrier, explained', 'Slide two: what damages the barrier', 'Slide three: how the serum helps']), caption: 'Your skin barrier, explained in three slides. Save this for the next time a product promises “glow” without telling you how. ✨', metrics: {likes: 18400, comments: 612, shares: 2900, saves: 9700}, caseStudy: 'caseStudy-lumera-launch'},
    {id: '03', title: 'Saffron & Salt — Friday special', type: 'post', platform: 'instagram', images: slides(['feed-03'], ['The Friday special plated on a saffron-yellow backdrop']), caption: 'This Friday only: slow-braised lamb shoulder, saffron rice, preserved lemon. Forty portions. When it’s gone, it’s gone.\n\nBook via the link in bio.', metrics: {likes: 6200, comments: 318, shares: 940, saves: 5100}, caseStudy: 'caseStudy-saffron-table'},
    {id: '04', title: 'Saffron & Salt — Market Monday story', type: 'story', platform: 'instagram', images: slides(['feed-04'], ['Story frame from the Monday market run']), caption: 'Market Monday: first figs of the season. Guess what’s on the menu this week?', metrics: {views: 48200, likes: 2100, shares: 310}, caseStudy: 'caseStudy-saffron-table'},
    {id: '05', title: 'Kitewell — Payments, explained #12 (carousel)', type: 'carousel', platform: 'linkedin', images: slides(['feed-05-a', 'feed-05-b', 'feed-05-c', 'feed-05-d'], ['Carousel cover: what actually happens when you tap to pay', 'Slide two: the four parties in a payment', 'Slide three: where fees come from', 'Slide four: what to ask your provider']), caption: 'What actually happens in the two seconds after you tap your card?\n\nWe drew it out — no jargon, promise. Swipe through and send it to the colleague who always asks.', metrics: {views: 164000, likes: 3900, comments: 284, shares: 1200}, caseStudy: 'caseStudy-kitewell-linkedin'},
    {id: '06', title: 'Kitewell — founder essay', type: 'post', platform: 'linkedin', images: slides(['feed-06'], ['Header artwork for the founder essay']), caption: '“Nobody wakes up excited about payments. They wake up excited about getting paid.”\n\nOur founder on why we stopped talking about features.', metrics: {views: 92000, likes: 2700, comments: 196, shares: 410}, caseStudy: 'caseStudy-kitewell-linkedin'},
    {id: '07', title: 'Tidewater — A Local’s Weekend (reel)', type: 'reel', platform: 'tiktok', images: slides(['feed-07'], ['Cover frame of the Local’s Weekend reel']), caption: '48 hours by the water, planned by the people who live here. Save for your next weekend away. 🌊', metrics: {views: 623000, likes: 71400, comments: 980, shares: 12300, saves: 28800}, caseStudy: 'caseStudy-tidewater-direct'},
    {id: '08', title: 'Tidewater — winter offer', type: 'post', platform: 'facebook', images: slides(['feed-08'], ['Announcement artwork for the winter offer']), caption: 'Followers first: three nights for the price of two, all winter. Message us for the direct-booking link.', metrics: {likes: 1900, comments: 264, shares: 520}, caseStudy: 'caseStudy-tidewater-direct'},
    {id: '09', title: 'Cedar Line — the 6am roast (reel)', type: 'reel', platform: 'instagram', images: slides(['feed-09'], ['Cover frame of the 6am roast reel']), caption: 'The roastery at 6am. No music, just the sound. ☕️', metrics: {views: 412000, likes: 38900, comments: 720, shares: 6100, saves: 9400}},
    {id: '10', title: 'Maison Nour — autumn edit (carousel)', type: 'carousel', platform: 'instagram', images: slides(['feed-10-a', 'feed-10-b', 'feed-10-c'], ['Carousel cover for the autumn edit', 'Slide two: the tailoring', 'Slide three: the palette']), caption: 'The autumn edit: three pieces, endlessly rewearable. Which one are you starting with?', metrics: {likes: 12300, comments: 402, shares: 1500, saves: 6800}},
    {id: '11', title: 'Pulse & Plank — member spotlight (story)', type: 'story', platform: 'instagram', images: slides(['feed-11'], ['Story frame from the member spotlight series']), caption: 'Member spotlight: 100 classes and counting. 👏', metrics: {views: 21400, likes: 1300, shares: 180}},
    {id: '12', title: 'Olive Row — what’s in season', type: 'post', platform: 'facebook', images: slides(['feed-12'], ['Seasonal produce artwork for the weekly market post']), caption: 'In season this week: blood oranges, wild fennel and the first asparagus. The stall opens at 8.', metrics: {likes: 2400, comments: 188, shares: 640}},
  ]
  const contentPieces: SeedDocument[] = FEED.map((item) => ({
    _id: `contentPiece-${item.id}`,
    _type: 'contentPiece',
    title: item.title,
    type: item.type,
    platform: item.platform,
    featured: true,
    images: item.images,
    caption: item.caption,
    originalUrl: 'https://example.com/original-post',
    metrics: item.metrics,
    ...(item.caseStudy ? {caseStudy: ref(item.caseStudy)} : {}),
  }))

  /* Services */
  const services: SeedDocument[] = [
    {_id: 'service-management', _type: 'service', title: 'Social media management', icon: 'calendar-days', description: 'End-to-end management of your channels: planning, publishing and performance, so your brand shows up consistently without the weekly scramble.', deliverables: ['Monthly content calendar', '12–20 posts per month', 'Scheduling & publishing', 'Monthly performance report'], startingPrice: '$1,200 / month'},
    {_id: 'service-community', _type: 'service', title: 'Community management', icon: 'messages-square', description: 'Fast, human replies to comments and DMs, with an escalation playbook and a tone of voice your audience recognises.', deliverables: ['Daily comment & DM coverage', 'Response playbook', 'Sentiment summary', 'Crisis escalation plan'], startingPrice: '$900 / month'},
    {_id: 'service-content', _type: 'service', title: 'Content creation', icon: 'clapperboard', description: 'Reels, carousels and stories designed for how people actually scroll — concepted, scripted, shot and edited.', deliverables: ['Concepts & scripts', 'Short-form video editing', 'Carousel & story design', 'Caption writing'], startingPrice: '$650 / project'},
    {_id: 'service-strategy', _type: 'service', title: 'Strategy & audits', icon: 'compass', description: 'A clear-eyed look at your channels, competitors and audience, turned into a strategy your team can run with.', deliverables: ['Channel & competitor audit', 'Content pillars', '90-day roadmap', 'Team workshop'], startingPrice: '$1,500'},
    {_id: 'service-campaigns', _type: 'service', title: 'Launches & creator campaigns', icon: 'rocket', description: 'Launch plans that build anticipation, and creator partnerships that feel like recommendations instead of adverts.', deliverables: ['Launch narrative & timeline', 'Creator sourcing & briefs', 'Launch-day coverage', 'Wrap-up report']},
  ]

  /* Stats */
  const stats: SeedDocument[] = [
    {_id: 'stat-views', _type: 'stat', label: 'Organic views generated', value: 12.6, suffix: 'M+', description: 'across client campaigns'},
    {_id: 'stat-brands', _type: 'stat', label: 'Brands partnered with', value: 40, suffix: '+', description: 'from start-ups to hotel groups'},
    {_id: 'stat-engagement', _type: 'stat', label: 'Average engagement rate', value: 6.8, suffix: '%', description: 'about 3× the industry average'},
    {_id: 'stat-response', _type: 'stat', label: 'Community messages answered', value: 85, suffix: 'K', description: 'by a person, not a bot'},
  ]

  /* Tools */
  const TOOLS: Array<[string, string, string]> = [
    ['later', 'Later', 'scheduling'],
    ['meta-business-suite', 'Meta Business Suite', 'scheduling'],
    ['notion', 'Notion', 'scheduling'],
    ['canva', 'Canva', 'design'],
    ['figma', 'Figma', 'design'],
    ['metricool', 'Metricool', 'analytics'],
    ['google-analytics', 'Google Analytics', 'analytics'],
    ['meta-ads-manager', 'Meta Ads Manager', 'ads'],
    ['tiktok-ads', 'TikTok Ads Manager', 'ads'],
    ['capcut', 'CapCut', 'video'],
    ['premiere', 'Premiere Pro', 'video'],
  ]
  const tools: SeedDocument[] = TOOLS.map(([id, name, category]) => ({
    _id: `tool-${id}`,
    _type: 'tool',
    name,
    category,
  }))

  /* Certifications (fictional issuers) */
  const certifications: SeedDocument[] = [
    {_id: 'certification-community', _type: 'certification', title: 'Advanced Community Management', issuer: 'Northlight Academy (sample)', year: 2024, credentialUrl: 'https://example.com/credential/community', badge: image('badge-1', 'Advanced Community Management badge')},
    {_id: 'certification-paid-social', _type: 'certification', title: 'Paid Social Strategy', issuer: 'Social Craft Institute (sample)', year: 2023, credentialUrl: 'https://example.com/credential/paid-social', badge: image('badge-2', 'Paid Social Strategy badge')},
  ]

  return [
    siteSettings,
    homePage,
    aboutPage,
    ...clients,
    ...testimonials,
    ...caseStudies,
    ...contentPieces,
    ...services,
    ...stats,
    ...tools,
    ...certifications,
  ]
}

/** Collections that get an `orderRank`, so drag-and-drop ordering works in the Studio. */
export const RANKED_TYPES = [
  'caseStudy',
  'contentPiece',
  'service',
  'testimonial',
  'client',
  'stat',
  'tool',
  'certification',
] as const
