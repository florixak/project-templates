import { setRequestLocale } from "next-intl/server"
import type { Locale } from "@/i18n/routing"

type HomeProps = {
  params: Promise<{ locale: Locale }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params

  // Call this in every page that should render statically, before using any
  // `next-intl` API.
  setRequestLocale(locale)

  return <section></section>
}
