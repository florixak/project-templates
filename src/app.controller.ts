import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiExcludeEndpoint()
  getVersionedRoot() {
    return {
      name: 'NestJS Starter API',
      version: 'v1',
      docs: '/docs',
      endpoints: ['/items', '/health', '/auth'],
    };
  }
}
