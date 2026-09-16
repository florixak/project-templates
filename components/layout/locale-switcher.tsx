"use client"

import { Check, Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, usePathname } from "@/i18n/navigation"
import { localeLabels, routing } from "@/i18n/routing"

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher")
  const activeLocale = useLocale()

  // `usePathname` from `@/i18n/navigation` returns the pathname *without* the
  // locale prefix, so pairing it with `locale` keeps the visitor on the same
  // page when they switch language.
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{t("label")}</span>
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            render={
              <Link
                href={pathname}
                locale={locale}
                aria-current={locale === activeLocale ? "true" : undefined}
              >
                {localeLabels[locale]}
                {locale === activeLocale ? <Check className="ml-auto" /> : null}
              </Link>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
