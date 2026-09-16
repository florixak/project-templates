import { applyDecorators } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

export const PublicRead = () =>
  applyDecorators(SkipThrottle({ write: true, auth: true }));
