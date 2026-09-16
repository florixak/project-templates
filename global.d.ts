import type { routing } from "./i18n/routing"
import type messages from "./messages/en.json"

// Makes `useTranslations`/`getTranslations` keys and the `Locale` type strict
// across the app: unknown namespaces or message keys become type errors, and
// `en.json` is the single source of truth for the message shape.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
