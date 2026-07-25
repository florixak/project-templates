import { BadRequestException } from '@nestjs/common';

const POSTGRES_FOREIGN_KEY_VIOLATION_CODE = '23503';

export function isPostgresForeignKeyViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const { code, cause } = error as { code?: string; cause?: unknown };
  return (
    code === POSTGRES_FOREIGN_KEY_VIOLATION_CODE ||
    isPostgresForeignKeyViolation(cause)
  );
}

export function rethrowIfForeignKeyViolation(
  error: unknown,
  message: string,
): never {
  if (isPostgresForeignKeyViolation(error)) {
    throw new BadRequestException(message);
  }
  throw error;
}
