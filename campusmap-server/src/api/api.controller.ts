import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('api')
@Controller()
export class ApiController {
  @Get()
  @ApiOperation({ summary: 'Ruta de bienvenida de la API' })
  getWelcome(): string {
    return 'Bienvenido a CampusMap Server';
  }
}
