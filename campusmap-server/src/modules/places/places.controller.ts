import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { FeatureCollectionDto } from '../../common/dto/geojson.dto';
import { PlacePropertiesDto } from './dtos/places.dto';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los lugares' })
  @ApiOkResponse({
    type: FeatureCollectionDto,
    description: 'Lista de lugares en formato GeoJSON',
  })
  getAllPlaces(): Promise<FeatureCollectionDto<PlacePropertiesDto>> {
    return this.placesService.getAllPlaces();
  }

  @Get('type/:code')
  @ApiOperation({ summary: 'Obtener lugares por tipo' })
  @ApiParam({
    name: 'code',
    type: String,
    description:
      'Código del tipo de lugar (por ejemplo: "building", "parking")',
    example: 'building',
  })
  @ApiOkResponse({
    type: FeatureCollectionDto,
    description: 'Lugares filtrados por tipo en formato GeoJSON',
  })
  getPlacesByType(
    @Param('code') code: string,
  ): Promise<FeatureCollectionDto<PlacePropertiesDto>> {
    return this.placesService.getPlacesByTypeCode(code);
  }
}
