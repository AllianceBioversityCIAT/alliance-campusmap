export interface PlaceFeature {
  type: 'Feature';
  properties: {
    id: number;
    name: string;
    icon?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: 'Point' | 'Polygon' | 'MultiPolygon';
    coordinates: number[] | number[][] | number[][][];
  };
}

export interface PlaceFeatureCollection {
  type: 'FeatureCollection';
  features: PlaceFeature[];
}
