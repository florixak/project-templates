import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class RootController {
  @Version(VERSION_NEUTRAL)
  @Get('/')
  @ApiExcludeEndpoint()
  welcome() {
    return {
      title: 'NestJS Starter API',
      description:
        'Production-ready NestJS starter (Variant A) with Drizzle, JWT auth, and OpenAPI docs.',
      documentation: '/docs',
      apiRoot: '/api/v1',
    };
  }
}
