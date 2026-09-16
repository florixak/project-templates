import { notFound } from "next/navigation"

// The `[locale]` segment only 404s on its own for an unsupported locale. This
// catch-all makes any other unmatched path (e.g. `/cs/nope`) render the
// localized `not-found` page instead of the English fallback.
//
// It deliberately sits outside the `(main)` group: a `loading.tsx` above this
// page would open a streaming boundary, so the 200 response headers would
// already be flushed by the time `notFound()` runs and the response would
// degrade to a soft 404.
export default function CatchAllPage() {
  notFound()
}
