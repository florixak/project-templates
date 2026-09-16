import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is the value of the `[locale]` segment. It can be missing
  // or invalid, because the segment also matches unknown paths such as
  // `/unknown.txt`. Falling back to the default locale keeps this function from
  // throwing; `app/[locale]/layout.tsx` is what turns an invalid segment into a
  // 404 response.
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
