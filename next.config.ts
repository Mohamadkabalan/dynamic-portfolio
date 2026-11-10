import type {NextConfig} from 'next'

const isDev = process.env.NODE_ENV !== 'production'

// Only set by `npm run dev:mock` (a local stand-in for Sanity). Empty in production.
const mockHosts = [
  process.env.NEXT_PUBLIC_SANITY_API_HOST,
  process.env.NEXT_PUBLIC_SANITY_IMAGE_HOST,
].filter((host): host is string => Boolean(host))
const mock = [...new Set(mockHosts)].join(' ')

const csp = (directives: Record<string, string>) =>
  Object.entries(directives)
    .map(([name, value]) => `${name} ${value}`.trim())
    .join('; ')

/**
 * Content Security Policy for the public website.
 * Pages are cached, so a per-request nonce is not possible; inline scripts
 * (Next.js' own bootstrapping and the theme script) are therefore allowed, but
 * scripts can only ever be loaded from this site.
 */
const siteCsp = csp({
  'default-src': "'self'",
  'script-src': `'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  'style-src': "'self' 'unsafe-inline'",
  'img-src': `'self' data: blob: https://cdn.sanity.io ${mock}`,
  'media-src': `'self' https://cdn.sanity.io ${mock}`,
  'font-src': "'self' data:",
  // The live-update connection goes straight from the browser to Sanity.
  'connect-src': `'self' https://*.api.sanity.io https://*.apicdn.sanity.io ${mock}${isDev ? ' ws: wss:' : ''}`,
  // Embedded posts and videos added by the editor.
  'frame-src':
    'https://www.youtube-nocookie.com https://player.vimeo.com https://www.instagram.com https://www.tiktok.com',
  'frame-ancestors': "'none'",
  'form-action': "'self'",
  'base-uri': "'self'",
  'object-src': "'none'",
  ...(isDev ? {} : {'upgrade-insecure-requests': ''}),
})

/**
 * The embedded Sanity Studio is an authenticated editing app with different
 * needs: it evaluates code at runtime, talks to several Sanity services, and
 * shows images and avatars from external hosts.
 */
const studioCsp = csp({
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://sanity-cdn.com https://*.sanity-cdn.com",
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data: blob: https:",
  'media-src': "'self' blob: https://cdn.sanity.io",
  'font-src': "'self' data: https:",
  'connect-src': `'self' https://*.sanity.io wss://*.sanity.io https://sanity-cdn.com https://*.sanity-cdn.com${isDev ? ' ws: wss:' : ''}`,
  'frame-src': "'self' https:",
  'worker-src': "'self' blob:",
  'frame-ancestors': "'self'",
  'form-action': "'self'",
  'base-uri': "'self'",
  'object-src': "'none'",
})

const sharedHeaders = [
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'},
  ...(isDev
    ? []
    : [{key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'}]),
]

const nextConfig: NextConfig = {
  // NOTE: `output: 'export'` must never be set here. A static export has no
  // server, so on-demand revalidation (the "no rebuild" publishing flow) breaks.

  // Cache Components is intentionally OFF. The site uses the tag-based ISR model:
  // pages are prerendered, cached, and purged by tag when content is published.
  // (`dynamicParams` and `generateStaticParams`-driven ISR, which the dynamic
  // routes rely on, are not available when Cache Components is enabled.)
  cacheComponents: false,

  poweredByHeader: false,

  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },

  images: {
    // Images are stored in Sanity and resized by Sanity's image CDN (see the loader).
    loader: 'custom',
    loaderFile: './sanity/lib/imageLoader.ts',
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**'}],
  },

  /** The site is one page: the former page addresses lead to the matching section. */
  async redirects() {
    return [
      {source: '/work', destination: '/#work', permanent: false},
      {source: '/about', destination: '/#about', permanent: false},
      {source: '/contact', destination: '/#contact', permanent: false},
    ]
  },

  /**
   * Security headers. These are set here (not only in netlify.toml) because
   * Netlify's own header rules do not apply to pages rendered by Next.js.
   */
  async headers() {
    return [
      {
        // Everything except the Studio: the site may never be framed.
        source: '/((?!studio).*)',
        headers: [
          ...sharedHeaders,
          {key: 'X-Frame-Options', value: 'DENY'},
          {key: 'Content-Security-Policy', value: siteCsp},
        ],
      },
      {
        // The Studio frames its own preview panes, so same-origin framing is allowed.
        source: '/studio/:path*',
        headers: [
          ...sharedHeaders,
          {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
          {key: 'Content-Security-Policy', value: studioCsp},
          {key: 'X-Robots-Tag', value: 'noindex, nofollow'},
        ],
      },
    ]
  },
}

export default nextConfig
