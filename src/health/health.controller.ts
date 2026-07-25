import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PublicRead } from '../common/decorators/public-read.decorator';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  @PublicRead()
  @ApiOperation({ summary: 'Check API and database health' })
  @HealthCheck()
  check() {
    return this.health.check([() => this.healthService.isDatabaseHealthy()]);
  }
}
