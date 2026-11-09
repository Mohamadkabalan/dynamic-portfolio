/**
 * A template re-mounts on every navigation, which gives each page a subtle
 * fade-and-rise transition. It is CSS-only and is switched off automatically
 * for visitors who prefer reduced motion (see globals.css).
 */
export default function Template({children}: {children: React.ReactNode}) {
  return <div className="animate-page-in">{children}</div>
}
