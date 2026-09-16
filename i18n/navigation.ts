import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

// Locale-aware wrappers around the `next/navigation` APIs. Always import
// `Link`, `redirect`, `usePathname` and `useRouter` from here rather than from
// `next/link` / `next/navigation`, otherwise the active locale is dropped from
// the resulting URL.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
