"use client"

import { useTranslations } from "next-intl"
import { useEffect } from "react"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const t = useTranslations("Error")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      <p className="text-muted-foreground max-w-md">
        {error.digest
          ? t("digest", { digest: error.digest })
          : t("description")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium"
      >
        {t("retry")}
      </button>
    </div>
  )
}
