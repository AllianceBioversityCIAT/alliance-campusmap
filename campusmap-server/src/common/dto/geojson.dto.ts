import { ApiProperty } from '@nestjs/swagger';

/**
 * GeoJSON geometry types supported by the API.
 * Based on RFC 7946 GeoJSON specification.
 */
export type GeoJsonGeometryType =
  | 'Point'
  | 'LineString'
  | 'Polygon'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'MultiPolygon';

/**
 * GeoJSON coordinates in various formats depending on geometry type:
 * - Point: [lng, lat]
 * - LineString or MultiPoint: [[lng, lat], [lng, lat], ...]
 * - Polygon or MultiLineString: [[[lng, lat], [lng, lat], ...], ...]
 * - MultiPolygon: [[[[lng, lat], [lng, lat], ...], ...], ...]
 */
export type GeoJsonCoordinates =
  | number[] // Point: [lng, lat]
  | number[][] // LineString or MultiPoint
  | number[][][] // Polygon or MultiLineString
  | number[][][][]; // MultiPolygon

/**
 * GeometryDto
 *
 * Represents a GeoJSON geometry object containing type and coordinates.
 * Follows the GeoJSON specification (RFC 7946).
 *
 * @property type - The geometry type (Point, Polygon, LineString, etc.)
 * @property coordinates - Coordinate array in [longitude, latitude] format
 */
export class GeometryDto {
  @ApiProperty({
    example: 'Point',
    enum: [
      'Point',
      'Polygon',
      'LineString',
      'MultiPoint',
      'MultiPolygon',
      'MultiLineString',
    ],
    description: 'GeoJSON geometry type',
  })
  type: GeoJsonGeometryType;

  @ApiProperty({
    example: [
      [-75.5812, 6.2476],
      [-75.5815, 6.2478],
    ],
    description: 'Coordinates in [longitude, latitude] format',
  })
  coordinates: GeoJsonCoordinates;
}

/**
 * FeatureDto<T>
 *
 * Represents a GeoJSON Feature object with geometry and properties.
 * Generic type T allows for custom property types per feature.
 *
 * @template T - Type of the properties object (defaults to any)
 * @property type - Always 'Feature' for GeoJSON features
 * @property geometry - The geometry object (point, polygon, etc.)
 * @property properties - Custom properties of type T
 * @property id - Optional unique identifier for the feature
 */
export class FeatureDto<T = any> {
  @ApiProperty({ example: 'Feature', description: 'GeoJSON feature type' })
  type = 'Feature' as const;

  @ApiProperty({ type: () => GeometryDto, description: 'Feature geometry' })
  geometry: GeometryDto;

  @ApiProperty({ description: 'Custom properties for the feature' })
  properties: T;

  @ApiProperty({ example: 1, required: false, description: 'Optional feature identifier' })
  id?: number | string;
}

/**
 * FeatureCollectionDto<T>
 *
 * Represents a GeoJSON FeatureCollection containing multiple features.
 * Generic type T defines the properties type for all features in the collection.
 *
 * @template T - Type of properties for all features (defaults to any)
 * @property type - Always 'FeatureCollection' for GeoJSON collections
 * @property name - Descriptive name for the collection
 * @property features - Array of Feature objects with properties of type T
 */
export class FeatureCollectionDto<T = any> {
  @ApiProperty({ example: 'FeatureCollection', description: 'GeoJSON collection type' })
  type = 'FeatureCollection' as const;
  
  @ApiProperty({ example: 'Places', description: 'Name of the feature collection' })
  name: string;
  
  @ApiProperty({ type: [FeatureDto], isArray: true, description: 'Array of GeoJSON features' })
  features: FeatureDto<T>[];
}
