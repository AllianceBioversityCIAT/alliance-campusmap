import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { FeatureCollectionDto } from '../../common/dto/geojson.dto';
import { PlacePropertiesDto } from './dtos/places.dto';

@ApiTags('Places of Palmira Campus')
/**
 * Controller for managing place resources.
 * Provides endpoints to retrieve all places or filter places by type.
 */
@Controller('places')
export class PlacesController {
  /**
   * Constructor for PlacesController.
   * @param placesService Service for place data operations.
   */
  constructor(private readonly placesService: PlacesService) {}

  /**
   * GET /places
   *
   * Returns all places as a GeoJSON FeatureCollection.
   * Optionally filters places by a search term (name or unit).
   *
   * @param search Optional search term to filter places by name or unit.
   * @returns Promise<FeatureCollectionDto<PlacePropertiesDto>> - FeatureCollection with all or filtered places.
   */
  @Get()
  @ApiOperation({ summary: 'Get all places', description: 'Returns all places as a GeoJSON FeatureCollection. Optionally filters by search term.' })
  @ApiOkResponse({
    type: FeatureCollectionDto,
    description: 'List of places in GeoJSON format',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    description: 'Search term to filter places by name or unit',
    required: false,
  })
  getAllPlaces(@Query('search') search?: string): Promise<FeatureCollectionDto<PlacePropertiesDto>> {
    return this.placesService.getAllPlaces(search);
  }

  /**
   * GET /places/type/:code
   *
   * Returns places filtered by the given type code as a GeoJSON FeatureCollection.
   *
   * @param code Type code to filter places (e.g. "building", "parking").
   * @returns Promise<FeatureCollectionDto<PlacePropertiesDto>> - FeatureCollection with filtered places.
   */
  @Get('type/:code')
  @ApiOperation({ summary: 'Get places by type', description: 'Returns places filtered by type code as a GeoJSON FeatureCollection.' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Type code for the place (e.g. "building", "parking")',
    example: 'building',
  })
  @ApiOkResponse({
    type: FeatureCollectionDto,
    description: 'Places filtered by type in GeoJSON format',
  })
  getPlacesByType(
    @Param('code') code: string,
  ): Promise<FeatureCollectionDto<PlacePropertiesDto>> {
    return this.placesService.getPlacesByTypeCode(code);
  }
}
