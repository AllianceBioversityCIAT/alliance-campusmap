import { ApiProperty } from '@nestjs/swagger';
import { GeometryDto } from '../../../common/dto/geojson.dto';

export class SitesPropertiesDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Edificio Principal' })
  name: string;
  type: string; 
  place: string;
  icon: string;
}

export class PlaceFeatureDto {
  @ApiProperty({ example: 'Feature' })
  type = 'Feature' as const;

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    type: () => GeometryDto,
    description: 'Área del lugar (Polygon)',
  })
  geometry: GeometryDto;

  @ApiProperty({ type: () => SitesPropertiesDto })
  properties: SitesPropertiesDto;
}
