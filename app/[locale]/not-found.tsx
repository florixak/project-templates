import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export default function NotFound() {
  const t = useTranslations("NotFoundPage")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      <p className="text-muted-foreground max-w-md">{t("description")}</p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium"
      >
        {t("backHome")}
      </Link>
    </div>
  )
}
