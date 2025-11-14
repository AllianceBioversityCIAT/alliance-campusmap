// Interface that defines the geometry (point, line, or polygon)
export interface Geometry {
  type: string;
  coordinates: number[] | number[][] | number[][][];
}

// Extra data that describes a place
export interface PlaceProperties {
  id: number;
  name: string;
  groupId?: number;
  typeId?: number;
  typeCode?: string;
  imageUrl?: string;
  centroid: Geometry;
}

// Represents a single geographic feature with geometry and properties
export interface PlaceFeature {
  type: 'Feature';
  id: number;
  geometry: Geometry;
  properties: PlaceProperties;
}

// A collection that groups multiple features together
export interface FeatureCollection {
  type: 'FeatureCollection';
  features: PlaceFeature[];
}
