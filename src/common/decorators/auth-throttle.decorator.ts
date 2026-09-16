import { applyDecorators } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

export const AuthThrottle = () =>
  applyDecorators(SkipThrottle({ read: true, write: true }));
