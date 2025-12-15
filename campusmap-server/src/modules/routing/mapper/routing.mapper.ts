import { RouteDetails } from '../entities/route-details.entity';
import {
  GeometryDto,
  FeatureDto,
  FeatureCollectionDto,
} from '../../../common/dto/geojson.dto';
import { LineString, Point } from 'geojson';

/**
 * Properties for a route step feature (simplified)
 */
export interface RouteStepPropertiesDto {
  id: string;
  step: number;
  instruction: string | null;
  next_instruction: string | null;
  cost_m: number | null;
}

/**
 * Route summary information
 */
export interface RouteSummaryDto {
  total_steps: number;
  total_distance_m: number;
  start_point: GeometryDto | null;
  end_point: GeometryDto | null;
  instructions: string[];
}

/**
 * Extended FeatureCollection with route summary
 */
export interface RouteFeatureCollectionDto
  extends FeatureCollectionDto<RouteStepPropertiesDto> {
  summary: RouteSummaryDto;
}

/**
 * Mapper for converting RouteDetails entities to GeoJSON format
 */
export class RoutingMapper {
  /**
   * Convert a single RouteDetails entity to a GeoJSON Feature
   * The geometry (LineString) already contains start and end points
   */
  static toFeature(
    routeDetail: RouteDetails,
  ): FeatureDto<RouteStepPropertiesDto> {
    return {
      type: 'Feature',
      id: routeDetail.id,
      geometry: this.lineStringToDto(routeDetail.geom),
      properties: {
        id: routeDetail.id,
        step: routeDetail.step,
        instruction: routeDetail.instruction || null,
        next_instruction: routeDetail.next_instruction || null,
        cost_m: routeDetail.cost_m ? Number(routeDetail.cost_m) : null,
      },
    };
  }

  /**
   * Convert LineString geometry to GeometryDto
   */
  private static lineStringToDto(
    geometry: LineString | null | undefined,
  ): GeometryDto {
    if (!geometry?.coordinates) {
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
    if (!geometry?.coordinates) {
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
   * Convert array of RouteDetails to GeoJSON FeatureCollection with summary
   */
  static toFeatureCollection(
    routeDetails: RouteDetails[],
    name: string = 'Route',
  ): RouteFeatureCollectionDto {
    const validDetails = routeDetails.filter(
      (detail) => detail !== null && detail !== undefined,
    );

    return {
      type: 'FeatureCollection',
      name,
      features: validDetails.map((detail) => this.toFeature(detail)),
      summary: this.toRouteSummary(validDetails),
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
  private static toRouteSummary(routeDetails: RouteDetails[]): RouteSummaryDto {
    if (routeDetails.length === 0) {
      return {
        total_steps: 0,
        total_distance_m: 0,
        start_point: null,
        end_point: null,
        instructions: [],
      };
    }

    return {
      total_steps: routeDetails.length,
      total_distance_m: this.calculateTotalDistance(routeDetails),
      start_point: this.pointToDto(routeDetails[0]?.start_point),
      end_point: this.pointToDto(routeDetails.at(-1)?.end_point),
      instructions: routeDetails
        .map((detail) => detail.instruction)
        .filter(
          (instruction) =>
            instruction !== null &&
            instruction !== undefined &&
            instruction.trim() !== '',
        ),
    };
  }
}
