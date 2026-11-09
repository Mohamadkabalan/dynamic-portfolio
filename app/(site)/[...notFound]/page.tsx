import {notFound} from 'next/navigation'

/**
 * Catches every address that no other route handles and shows the custom 404
 * page (app/(site)/not-found.tsx) inside the normal site layout.
 */
export const dynamic = 'force-static'

export default function CatchAllNotFound() {
  notFound()
}
