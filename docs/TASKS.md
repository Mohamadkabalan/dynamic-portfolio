# Build task list

Status key: `[x]` done · `[~]` in progress · `[ ]` to do

## Phase 1 — Scaffold, Sanity config, schemas, embedded Studio
- [x] Scaffold Next.js (App Router, TypeScript strict, Tailwind v4)
- [x] Install Sanity, next-sanity, motion, lucide-react
- [x] Read the installed next-sanity v13 migration guide + type definitions and the bundled Next.js 16 docs
- [x] Shared constants (platforms, section keys, icon list)
- [x] Schemas: singletons (siteSettings, homePage, aboutPage)
- [x] Schemas: collections (caseStudy, contentPiece, service, testimonial, client, stat, tool, certification)
- [x] Studio structure (Settings / Pages / Portfolio / Feed / Social Proof / Library), singleton rules, Vision
- [x] Embedded Studio at /studio (noindex)
- [x] Commit

## Phase 2 — Data layer
- [x] Sanity client + `defineLive` (`sanityFetch`, `<SanityLive />`)
- [x] GROQ queries in `sanity/lib/queries.ts` (`defineQuery`)
- [x] TypeGen (`sanity schema extract` + `sanity typegen generate`)
- [x] Image helpers (hotspot/crop, LQIP)
- [x] `/api/revalidate` webhook + tests
- [x] Commit

## Phase 3 — Design system + layout shell
- [x] `docs/design.md`
- [x] Tokens, fonts, light/dark, CMS-driven accent with auto contrast
- [x] Header, footer, skip link, theme toggle, page transitions
- [x] Commit

## Phase 4 — Pages and sections
- [x] Home (hero, logo marquee, stats, featured work, feed + lightbox, services, testimonials, tools, contact CTA)
- [x] /work (filters), /work/[slug]
- [x] /about, /contact, custom 404
- [x] Commit

## Phase 5 — Contact form, SEO, OG images, sitemap
- [x] Netlify Forms (`public/__forms.html` + fetch submit, honeypot, states)
- [x] Metadata from CMS, `sitemap.xml`, `robots.txt`, dynamic OG images
- [x] Commit

## Phase 6 — Seed script
- [x] Idempotent seed with locally generated placeholder images
- [x] Commit

## Phase 7 — Verification + README
- [ ] `netlify.toml` + security headers
- [ ] Build, lint, type check, tests
- [ ] Live-update, new-slug and delete checks against a real Sanity project
- [ ] Lighthouse mobile (Home + case study)
- [ ] README (setup guide + "How to edit your site")
- [ ] Commit
