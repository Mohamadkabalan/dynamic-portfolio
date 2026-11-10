import type {Metadata} from 'next'

import {ButtonLink} from '@/components/ui/Button'
import {Eyebrow} from '@/components/ui/SectionHeading'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: {index: false, follow: true},
}

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70dvh] flex-col justify-center section-y">
      <Eyebrow className="mb-6">Error 404</Eyebrow>
      <h1 className="text-display-xl max-w-4xl">
        This post has been <em className="text-accent-display">archived.</em>
      </h1>
      <p className="text-lead mt-6 max-w-xl text-ink-2">
        The page you were looking for has moved, been renamed, or never existed. The good stuff is
        still one tap away.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/#work" size="lg">
          See the work
        </ButtonLink>
        <ButtonLink href="/" size="lg" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </section>
  )
}
