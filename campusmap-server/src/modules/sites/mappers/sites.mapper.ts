import {
  GeometryDto,
  FeatureDto,
  FeatureCollectionDto,
} from '../../../common/dto/geojson.dto';
import { Point, Polygon, MultiPolygon } from 'geojson';
import { Site } from '../entities/site.entity';
import { SitesPropertiesDto } from '../dto/sites.dto';

type SupportedGeometry = Point | Polygon | MultiPolygon;

export class SiteMapper {
  static toFeature(site: Site): FeatureDto<SitesPropertiesDto> {
    const typeCode = site.type?.code;
    return {
      type: 'Feature',
      id: site.id,
      geometry: this.geometryToDto(site.coords as SupportedGeometry),
      properties: {
        id: site.id,
        name: site.name,
        type: typeCode,
        place: site.place?.name,
        icon: site.icon,
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
    sites: Site[],
    name: string,
  ): FeatureCollectionDto<SitesPropertiesDto> {
    return {
      type: 'FeatureCollection',
      name,
      features: sites.map((site) => this.toFeature(site)),
    };
  }
}
