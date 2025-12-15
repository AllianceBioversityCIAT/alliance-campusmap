import { Controller, Get, Query } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

interface PointQueryResult {
  geom: string;
}

@ApiTags('Routing')
@Controller('routing')
export class RoutingController {
  constructor(
    private readonly routingService: RoutingService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('/place')
  @ApiQuery({ name: 'lon', required: true, type: Number })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'placeId', required: true, type: Number })
  @ApiQuery({ name: 'mode', required: true, type: Number })
  async getRouteToPlace(
    @Query('lon') lon: number,
    @Query('lat') lat: number,
    @Query('placeId') placeId: number,
    @Query('mode') mode: number,
  ) {
    const pointResult: PointQueryResult[] = await this.dataSource.query(
      'SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) as geom',
      [lon, lat],
    );

    return await this.routingService.getRouteToPlaceFromLocation(
      pointResult[0].geom,
      Number(placeId),
      Number(mode),
    );
  }
}
