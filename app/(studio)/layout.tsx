import type {Metadata} from 'next'

/**
 * The Studio has its own root layout so none of the website's chrome, styles
 * or live-update listeners are loaded inside the editing interface.
 */
export const metadata: Metadata = {
  title: 'Portfolio CMS',
  robots: {index: false, follow: false},
}

export default function StudioLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body style={{margin: 0}}>{children}</body>
    </html>
  )
}
