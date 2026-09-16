import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // English is the source language, Czech is the translation.
  locales: ["en", "cs"],
  defaultLocale: "en",

  // English is served from `/`, Czech from `/cs`.
  localePrefix: "as-needed",

  // The URL is the only source of truth for the locale: no `accept-language`
  // sniffing and no locale cookie, so a URL always renders the same language
  // for every visitor and stays safe to cache on a CDN.
  localeDetection: false,
  localeCookie: false,
})

export type Locale = (typeof routing.locales)[number]

export const localeLabels: Record<Locale, string> = {
  en: "English",
  cs: "Čeština",
}
