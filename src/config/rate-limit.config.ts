export const RATE_LIMITS = {
  read: { ttl: 60_000, limit: 200 },
  write: { ttl: 60_000, limit: 20 },
  auth: { ttl: 60_000, limit: 5 },
} as const;
