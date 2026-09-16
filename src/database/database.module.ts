import { Module } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { createDatabaseConnection, Database } from './database-connection';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService): Database =>
        createDatabaseConnection(config.databaseUrl),
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
