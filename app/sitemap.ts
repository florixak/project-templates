import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { localeAlternates, localeUrl } from "@/lib/metadata"

// Locale-independent pathnames that should be indexed. Add new routes here and
// every locale variant is emitted automatically.
const pathnames = ["/"]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return pathnames.flatMap((pathname) =>
    routing.locales.map((locale) => ({
      url: localeUrl(pathname, locale),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 1,
      alternates: {
        languages: localeAlternates(pathname),
      },
    })),
  )
}
