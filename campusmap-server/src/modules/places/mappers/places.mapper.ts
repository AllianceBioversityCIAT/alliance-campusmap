import { Place } from '../entities/place.entity';
import { PlacePropertiesDto } from '../dtos/places.dto';
import { GeometryDto, FeatureDto, FeatureCollectionDto } from '../../../common/dto/geojson.dto';
import { Point, Polygon, MultiPolygon } from 'geojson';

type SupportedGeometry = Point | Polygon | MultiPolygon;

export class PlacesMapper {
  static toFeature(place: Place): FeatureDto<PlacePropertiesDto> {
    return {
      type: 'Feature',
      id: place.id,
      geometry: this.geometryToDto(place.area as SupportedGeometry),
      properties: {
        id: place.id,
        name: place.name,
        groupId: place.groupId,
        typeId: place.typeId,
        imageUrl: place.imageUrl,
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

  static toFeatureCollection(places: Place[], name: string): FeatureCollectionDto<PlacePropertiesDto> {
    return {
      type: 'FeatureCollection',
      name,
      features: places.map(place => this.toFeature(place)),
    };
  }
}