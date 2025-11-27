import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
/**
 * AppController
 *
 * Provides health check endpoint for the application.
 * Used to verify that the server is running and responsive.
 */
@Controller()
export class AppController {
  /**
   * Constructor for AppController.
   * @param appService Service providing application health status.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * GET /health
   *
   * Health check endpoint that returns a simple status message.
   * Used by monitoring tools and load balancers to verify service availability.
   *
   * @returns {string} Health status message
   */
  @Get('/health')
  @ApiOperation({ summary: 'Health check endpoint', description: 'Returns server health status' })
  getHello(): string {
    return this.appService.getHello();
  }
}
