import { ApiProperty } from '@nestjs/swagger';

export type GeoJsonGeometryType = 
  | 'Point' 
  | 'LineString' 
  | 'Polygon' 
  | 'MultiPoint' 
  | 'MultiLineString' 
  | 'MultiPolygon';

export type GeoJsonCoordinates = 
  | number[]                    // Point: [lng, lat]
  | number[][]                  // LineString o MultiPoint
  | number[][][]                // Polygon o MultiLineString
  | number[][][][];             // MultiPolygon

export class GeometryDto {
  @ApiProperty({ 
    example: 'Point',
    enum: ['Point', 'Polygon', 'LineString', 'MultiPoint', 'MultiPolygon', 'MultiLineString']
  })
  type: GeoJsonGeometryType;

  @ApiProperty({ 
    example: [[-75.5812, 6.2476], [-75.5815, 6.2478]],
    description: 'Coordenadas en formato [longitude, latitude]'
  })
  coordinates: GeoJsonCoordinates;
}

export class FeatureDto<T = any> {
  @ApiProperty({ example: 'Feature' })
  type: 'Feature' = 'Feature';

  @ApiProperty({ type: () => GeometryDto })
  geometry: GeometryDto;

  @ApiProperty()
  properties: T;

  @ApiProperty({ example: 1, required: false })
  id?: number | string;
}

export class FeatureCollectionDto<T = any> {
  @ApiProperty({ example: 'FeatureCollection' })
  type: 'FeatureCollection' = 'FeatureCollection';
  @ApiProperty({ example: 'Places' })
  name: string;
  @ApiProperty({ type: [FeatureDto], isArray: true })
  features: FeatureDto<T>[];
}