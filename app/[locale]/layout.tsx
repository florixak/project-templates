import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Toaster } from "react-hot-toast"
import "../globals.css"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { routing } from "@/i18n/routing"
import { createMetadata } from "@/lib/metadata"

// `latin-ext` carries the Czech diacritics (č, ě, ř, š, ť, ů, ž) that are
// missing from the `latin` subset — without it those glyphs fall back to a
// system font.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
})

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params
  const resolvedLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale
  const t = await getTranslations({
    locale: resolvedLocale,
    namespace: "Metadata",
  })

  return createMetadata({
    locale: resolvedLocale,
    description: t("description"),
  })
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  // The `[locale]` segment doubles as a catch-all for unmatched paths, so an
  // unsupported value has to 404 instead of rendering the app in English.
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Lets every Server Component below read the locale without `headers()`,
  // which is what keeps these routes statically rendered.
  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Rendered by a Server Component, so locale and messages are
            forwarded to Client Components automatically. */}
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster position="bottom-right" />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
