import { useTranslations } from "next-intl"
import { siteConfig } from "@/lib/config"

export default function Footer() {
  const t = useTranslations("Footer")

  return (
    <footer className="bg-footer border-border border-t">
      <div className="text-muted-foreground mx-auto flex h-14 max-w-7xl items-center justify-center px-4 text-xs sm:px-6 lg:px-8">
        {t("rights", {
          // Passed as a string on purpose: a number would be run through
          // `Intl.NumberFormat` and rendered with a group separator ("2,026").
          year: String(new Date().getFullYear()),
          name: siteConfig.name,
        })}
      </div>
    </footer>
  )
}
