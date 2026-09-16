import type { Metadata } from "next"
import { getPathname } from "@/i18n/navigation"
import { type Locale, routing } from "@/i18n/routing"
import { siteConfig } from "@/lib/config"

type MetadataProps = {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
  canonicalUrl?: string
  /** Active locale. Drives `og:locale` and which alternate is canonical. */
  locale?: Locale
  /** Locale-independent pathname (e.g. `/about`), used to build alternates. */
  pathname?: string
}

// `og:locale` expects `language_TERRITORY`, not a bare language code.
const ogLocales: Record<Locale, string> = {
  en: "en_US",
  cs: "cs_CZ",
}

function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString()
}

/** Absolute URL at which `pathname` is served in `locale`. */
export function localeUrl(pathname: string, locale: Locale) {
  return absoluteUrl(getPathname({ href: pathname, locale }))
}

/**
 * `hreflang` map for a pathname. `x-default` points at the default locale so
 * search engines know which version to show for unmatched languages.
 */
export function localeAlternates(pathname: string) {
  const languages: Record<string, string> = {}

  for (const locale of routing.locales) {
    languages[locale] = localeUrl(pathname, locale)
  }
  languages["x-default"] = localeUrl(pathname, routing.defaultLocale)

  return languages
}

export function createMetadata({
  title,
  description,
  image,
  noIndex,
  canonicalUrl,
  locale,
  pathname = "/",
}: MetadataProps = {}): Metadata {
  const resolvedTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name
  const resolvedDescription = description ?? siteConfig.description
  const resolvedImage = image ?? `${siteConfig.url}/og.png`
  const resolvedCanonical =
    canonicalUrl ?? (locale ? localeUrl(pathname, locale) : siteConfig.url)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: resolvedCanonical,
      languages: localeAlternates(pathname),
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: resolvedCanonical,
      siteName: siteConfig.name,
      images: [{ url: resolvedImage }],
      locale: locale ? ogLocales[locale] : undefined,
      alternateLocale: locale
        ? routing.locales
            .filter((candidate) => candidate !== locale)
            .map((candidate) => ogLocales[candidate])
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [resolvedImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export function createPageMetadata(props: MetadataProps): Metadata {
  return createMetadata(props)
}
