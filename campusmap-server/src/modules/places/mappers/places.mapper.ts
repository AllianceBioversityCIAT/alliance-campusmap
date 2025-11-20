import { Place } from '../entities/place.entity';
import { PlacePropertiesDto } from '../dtos/places.dto';
import {
  GeometryDto,
  FeatureDto,
  FeatureCollectionDto,
} from '../../../common/dto/geojson.dto';
import { Point, Polygon, MultiPolygon } from 'geojson';

type SupportedGeometry = Point | Polygon | MultiPolygon;

export class PlacesMapper {
  static toFeature(place: Place): FeatureDto<PlacePropertiesDto> {
    const typeCode = place.type?.code;
    return {
      type: 'Feature',
      id: place.id,
      geometry: this.geometryToDto(place.area as SupportedGeometry),
      properties: {
        id: place.id,
        name: place.name,
        type: typeCode,
        icon: place.icon,
        color: place.color,
        units: place.units?.map((unit) => ({ id: unit.id, name: unit.name })) || [],
        centroid: this.geometryToDto(place.centroid as SupportedGeometry),
      },
    };
  }

  private static geometryToDto(geometry: SupportedGeometry): GeometryDto {
    return {
      type: geometry.type,
      coordinates: geometry.coordinates,
    };
  }

  static toFeatureCollection(
    places: Place[],
    name: string,
  ): FeatureCollectionDto<PlacePropertiesDto> {
    return {
      type: 'FeatureCollection',
      name,
      features: places.map((place) => this.toFeature(place)),
    };
  }
}
