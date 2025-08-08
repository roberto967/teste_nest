import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckDto } from './common/dtos/healt-check.dto';
import { AppInfoDto } from './common/dtos/app-info.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get('info')
  @ApiOperation({ summary: 'Get app information' })
  @ApiOkResponse({
    description: 'Returns general information about the application',
    type: AppInfoDto,
  })
  getAppInfo(): AppInfoDto {
    return this.appService.getAppInfo();
  }

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Check health status' })
  @ApiOkResponse({
    description: 'Returns the health status of the application',
    type: HealthCheckDto,
  })
  check() {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
      async () =>
        this.http.pingCheck('api-docs', 'http://localhost:5000/api-doc'),
    ]);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('hello')
  async getHello() {
    return this.appService.getHello();
  }
}
