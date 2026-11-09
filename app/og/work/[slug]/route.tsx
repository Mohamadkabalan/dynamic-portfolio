import {caseStudyCard} from '@/lib/og'
import {siteName} from '@/lib/site'
import {getCaseStudyMeta, getSiteSettings} from '@/sanity/lib/data'
import {hasAsset, staticImageUrl} from '@/sanity/lib/image'

/**
 * GET /og/work/<slug> — the social-sharing image for one case study, drawn
 * from its title, results and cover. Generated on first request, then cached
 * until the case study changes.
 */
export const dynamic = 'force-static'
export const dynamicParams = true

export async function GET(_request: Request, {params}: RouteContext<'/og/work/[slug]'>) {
  const {slug} = await params
  const [study, settings] = await Promise.all([getCaseStudyMeta(slug), getSiteSettings()])
  if (!study) return new Response('Not found', {status: 404})

  return caseStudyCard({
    title: study.title,
    eyebrow: [study.clientName, study.industry].filter(Boolean).join(' · '),
    results: (study.results ?? []).map((result) => ({
      label: result.label,
      value: `${result.prefix ?? ''}${result.value.toLocaleString('en')}${result.suffix ?? ''}`,
    })),
    coverUrl: hasAsset(study.cover)
      ? staticImageUrl(study.cover, {width: 964, height: 1148, format: 'jpg'})
      : null,
    authorName: siteName(settings),
    accentColor: settings?.accentColor,
  })
}
