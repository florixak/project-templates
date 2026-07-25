import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class DisabledInProductionGuard implements CanActivate {
  constructor(private readonly config: AppConfigService) {}

  canActivate(): boolean {
    if (this.config.isProduction) {
      throw new ForbiddenException(
        'Write operations are disabled in the production environment.',
      );
    }
    return true;
  }
}
