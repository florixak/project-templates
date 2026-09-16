import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// Picks up `i18n/request.ts` automatically.
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [],
  },
}

export default withNextIntl(nextConfig)
