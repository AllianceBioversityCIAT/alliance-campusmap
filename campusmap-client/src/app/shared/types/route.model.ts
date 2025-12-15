import { Geometry } from '@shared/types/place.model';

export type RouteProperties = Record<string, unknown>;

export interface RouteFeature {
  type: 'Feature';
  id?: number | string;
  geometry: Geometry; // Typically LineString or MultiLineString
  properties: RouteProperties;
}

export interface RouteFeatureCollection {
  type: 'FeatureCollection';
  features: RouteFeature[];
}
