import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { RATE_LIMITS } from './config/rate-limit.config';
import { validate } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { ItemsModule } from './items/items.module';
import { RootController } from './root.controller';
import { DisabledInProductionGuard } from './common/guards/disabled-in-production.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'read', ...RATE_LIMITS.read },
        { name: 'write', ...RATE_LIMITS.write },
        { name: 'auth', ...RATE_LIMITS.auth },
      ],
      skipIf: (context) => {
        const request = context.switchToHttp().getRequest<{ url?: string }>();
        return (
          request.url === '/docs' ||
          (request.url?.startsWith('/docs/') ?? false)
        );
      },
    }),
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    ItemsModule,
    HealthModule,
  ],
  controllers: [AppController, RootController],
  providers: [
    AppService,
    DisabledInProductionGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
