import { ApiProperty } from '@nestjs/swagger';
import { GeometryDto } from '../../../common/dto/geojson.dto';

export class PlacePropertiesDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Edificio Principal' })
  name: string;

  @ApiProperty({
    isArray: true,
    type: () => Object,
    description: 'Unidades asociadas al lugar',
  })
  units?: { id: number; name: string }[];

  @ApiProperty({ example: 1, required: false })
  typeId?: number;

<<<<<<< Updated upstream
  @ApiProperty({ example: 'https://...', required: false })
  imageUrl?: string;

=======
  icon: string;
  color: string;
>>>>>>> Stashed changes
  @ApiProperty({ type: () => GeometryDto, description: 'Centroid del lugar' })
  centroid: GeometryDto;
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

  @ApiProperty({ type: () => PlacePropertiesDto })
  properties: PlacePropertiesDto;
}
