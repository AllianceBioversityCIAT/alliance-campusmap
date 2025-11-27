import { ApiProperty } from '@nestjs/swagger';
import { GeometryDto } from '../../../common/dto/geojson.dto';

/**
 * SitesPropertiesDto
 *
 * Properties object for site features in GeoJSON format.
 * Contains metadata about a site including its identification, name,
 * type, associated place, and display icon.
 */
export class SitesPropertiesDto {
  /** Unique identifier for the site */
  @ApiProperty({ example: 1, description: 'Site ID' })
  id: number;

  /** Name of the site */
  @ApiProperty({ example: 'Main Building Bathroom', description: 'Site name' })
  name: string;
  
  /** Type code of the site (e.g., "bathroom", "assembly-point") */
  @ApiProperty({ example: 'bathroom', description: 'Site type code' })
  type: string;
  
  /** Name of the place where this site is located */
  @ApiProperty({ example: 'Building A', description: 'Associated place name' })
  place: string;
  
  /** Icon identifier for map display */
  @ApiProperty({ example: 'bathroom-icon.svg', description: 'Icon path or identifier' })
  icon: string;
}

/**
 * PlaceFeatureDto
 *
 * GeoJSON Feature representation for a site.
 * Wraps site properties with point geometry in standard GeoJSON format.
 */
export class PlaceFeatureDto {
  /** GeoJSON feature type (always 'Feature') */
  @ApiProperty({ example: 'Feature', description: 'GeoJSON feature type' })
  type = 'Feature' as const;

  /** Unique identifier for the feature */
  @ApiProperty({ example: 1, description: 'Feature ID' })
  id: number;

  /** Point geometry of the site location */
  @ApiProperty({
    type: () => GeometryDto,
    description: 'Site location as Point geometry',
  })
  geometry: GeometryDto;

  /** Site properties and metadata */
  @ApiProperty({ type: () => SitesPropertiesDto, description: 'Site properties' })
  properties: SitesPropertiesDto;
}
