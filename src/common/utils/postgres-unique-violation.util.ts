import { ConflictException } from '@nestjs/common';

const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';

export function isPostgresUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const { code, cause } = error as { code?: string; cause?: unknown };
  return (
    code === POSTGRES_UNIQUE_VIOLATION_CODE || isPostgresUniqueViolation(cause)
  );
}

export function rethrowIfUniqueViolation(
  error: unknown,
  message: string,
): never {
  if (isPostgresUniqueViolation(error)) {
    throw new ConflictException(message);
  }
  throw error;
}
