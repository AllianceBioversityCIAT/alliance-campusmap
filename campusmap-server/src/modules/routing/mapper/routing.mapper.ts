import { RouteDetails } from '../entities/route-details.entity';
import { 
  GeometryDto, 
  FeatureDto, 
  FeatureCollectionDto 
} from '../../../common/dto/geojson.dto';
import { LineString, Point } from 'geojson';

/**
 * Properties for a route step feature
 */
export interface RouteStepPropertiesDto {
  id: string;
  step: number;
  start_point: GeometryDto;
  end_point: GeometryDto;
  instruction: string | null;
  next_instruction: string | null;
  cost_m: number | null;
}

/**
 * Mapper for converting RouteDetails entities to GeoJSON format
 */
export class RoutingMapper {
  /**
   * Convert a single RouteDetails entity to a GeoJSON Feature
   */
  static toFeature(routeDetail: RouteDetails): FeatureDto<RouteStepPropertiesDto> {
    return {
      type: 'Feature',
      id: routeDetail.id,
      geometry: this.lineStringToDto(routeDetail.geom),
      properties: {
        id: routeDetail.id,
        step: routeDetail.step,
        start_point: this.pointToDto(routeDetail.start_point),
        end_point: this.pointToDto(routeDetail.end_point),
        instruction: routeDetail.instruction || null,
        next_instruction: routeDetail.next_instruction || null,
        cost_m: routeDetail.cost_m ? Number(routeDetail.cost_m) : null,
      },
    };
  }

  /**
   * Convert LineString geometry to GeometryDto
   */
  private static lineStringToDto(geometry: LineString | null | undefined): GeometryDto {
    if (!geometry || !geometry.coordinates) {
      return {
        type: 'LineString',
        coordinates: [],
      };
    }
    
    return {
      type: geometry.type,
      coordinates: geometry.coordinates,
    };
  }

  /**
   * Convert Point geometry to GeometryDto
   */
  private static pointToDto(geometry: Point | null | undefined): GeometryDto {
    if (!geometry || !geometry.coordinates) {
      return {
        type: 'Point',
        coordinates: [],
      };
    }
    
    return {
      type: geometry.type,
      coordinates: geometry.coordinates,
    };
  }

  /**
   * Convert array of RouteDetails to GeoJSON FeatureCollection
   */
  static toFeatureCollection(
    routeDetails: RouteDetails[],
    name: string = 'Route'
  ): FeatureCollectionDto<RouteStepPropertiesDto> {
    return {
      type: 'FeatureCollection',
      name,
      features: routeDetails
        .filter((detail) => detail !== null && detail !== undefined)
        .map((detail) => this.toFeature(detail)),
    };
  }

  /**
   * Calculate total distance of the route in meters
   */
  static calculateTotalDistance(routeDetails: RouteDetails[]): number {
    return routeDetails.reduce((total, detail) => {
      return total + (detail.cost_m ? Number(detail.cost_m) : 0);
    }, 0);
  }

  /**
   * Convert route details to a summary object
   */
  static toRouteSummary(routeDetails: RouteDetails[]) {
    const validDetails = routeDetails.filter(d => d !== null && d !== undefined);
    
    if (validDetails.length === 0) {
      return {
        total_steps: 0,
        total_distance_m: 0,
        start_point: null,
        end_point: null,
        instructions: [],
      };
    }

    return {
      total_steps: validDetails.length,
      total_distance_m: this.calculateTotalDistance(validDetails),
      start_point: this.pointToDto(validDetails[0]?.start_point),
      end_point: this.pointToDto(validDetails[validDetails.length - 1]?.end_point),
      instructions: validDetails
        .map(detail => detail.instruction)
        .filter(instruction => instruction !== null && instruction !== undefined && instruction.trim() !== ''),
    };
  }
}