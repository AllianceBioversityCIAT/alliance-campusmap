import { Controller, Get, Param } from '@nestjs/common';
import { SitesService } from './sites.service';
import { FeatureCollectionDto } from 'src/common/dto/geojson.dto';
import { SitesPropertiesDto } from './dto/sites.dto';
import { SiteMapper } from './mappers/sites.mapper';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Sites of Palmira Campus')
/**
 * Controller for managing site resources.
 * Provides endpoints to retrieve all sites or filter sites by type.
 */
@Controller('sites')
export class SitesController {
  /**
   * Constructor for SitesController.
   * @param sitesService Service for site data operations.
   */
  constructor(private readonly sitesService: SitesService) {}

  /**
   * Get all sites.
   *
   * Returns a GeoJSON FeatureCollection containing all sites.
   *
   * @returns {Promise<FeatureCollectionDto<SitesPropertiesDto>>} FeatureCollection with all sites.
   */
  @Get()
  @ApiOperation({
    summary: 'Get all sites',
    description: 'Returns all sites as a GeoJSON FeatureCollection.',
  })
  async getAllSites(): Promise<FeatureCollectionDto<SitesPropertiesDto>> {
    return SiteMapper.toFeatureCollection(
      await this.sitesService.getAllSites(),
      'All Sites',
    );
  }

  /**
   * Get sites by type code.
   *
   * Returns a GeoJSON FeatureCollection containing sites filtered by the given type code.
   *
   * @param code Site type code (e.g. "bathroom", "assembly-point").
   * @returns {Promise<FeatureCollectionDto<SitesPropertiesDto>>} FeatureCollection with filtered sites.
   */
  @Get('type/:code')
  @ApiOperation({
    summary: 'Get sites by type',
    description:
      'Returns sites filtered by type code as a GeoJSON FeatureCollection.',
  })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Site type code (e.g. "bathroom", "assembly-point")',
    example: 'assembly point',
  })
  async getSitesByTypeCode(
    @Param('code') code: string,
  ): Promise<FeatureCollectionDto<SitesPropertiesDto>> {
    return SiteMapper.toFeatureCollection(
      await this.sitesService.getSiteByTypeCode(code),
      `Sites of type ${code}`,
    );
  }
}
