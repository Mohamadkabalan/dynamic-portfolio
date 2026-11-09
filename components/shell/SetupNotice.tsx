import {ButtonLink} from '@/components/ui/Button'
import {Eyebrow} from '@/components/ui/SectionHeading'

interface SetupNoticeProps {
  /** `connect` = env vars missing; `content` = connected but nothing published yet. */
  state: 'connect' | 'content'
}

/** Shown instead of an error while the CMS is not connected or still empty. */
export function SetupNotice({state}: SetupNoticeProps) {
  return (
    <section className="shell section-y">
      <div className="max-w-2xl">
        <Eyebrow className="mb-5">Setup</Eyebrow>
        {state === 'connect' ? (
          <>
            <h1 className="text-display-lg">Connect your CMS to bring this site to life.</h1>
            <p className="text-lead mt-6 text-ink-2">
              The site is running, but it is not connected to Sanity yet. Add your Sanity project
              ID to the environment variables (<code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>) — the
              README walks through it step by step — then restart or redeploy once.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-display-lg">Your site is ready for content.</h1>
            <p className="text-lead mt-6 text-ink-2">
              Nothing has been published yet. Open the Studio, fill in the Home page and Site
              settings, and press Publish — this page updates by itself within a few seconds.
            </p>
            <ButtonLink href="/studio" size="lg" className="mt-8" prefetch={false}>
              Open the Studio
            </ButtonLink>
          </>
        )}
      </div>
    </section>
  )
}
