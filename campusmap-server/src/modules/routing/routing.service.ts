import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Place } from '../places/entities/place.entity';
import { RouteDetails } from './entities/route-details.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutingMapper } from './mapper/routing.mapper';

// Type definitions for database query results
interface GeomResult {
  geom: string;
}

interface IdResult {
  id: number;
}

interface RouteStepRaw {
  step: number;
  instruction: string;
  start_point: unknown;
  next_instruction: string;
  end_point: unknown;
  geom: unknown;
  cost_m: string | number | null;
}

@Injectable()
export class RoutingService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(RouteDetails)
    private readonly routeDetailsRepository: Repository<RouteDetails>,
  ) {}

  async getRouteToPlaceFromLocation(
    point: string,
    placeId: number,
    mode: number,
  ) {
    // Validar modo de transporte
    if (![1, 2, 3].includes(mode)) {
      throw new Error('Invalid mode. Valid modes: 1 (walk), 2 (car), 3 (bike)');
    }

    // Obtener geometría del lugar destino
    const placeGeomResult = await this.dataSource.query<GeomResult[]>(
      'SELECT ST_SetSRID(centroid, 4326) as geom FROM campus_map.places WHERE id = $1',
      [placeId],
    );

    if (!placeGeomResult[0]) {
      throw new Error('Place not found');
    }

    let verticeDestino: number;

    // Si es modo carro (2), buscar el parqueadero más cercano
    if (mode === 2) {
      const parkingId = await this.getParkingNearest(placeGeomResult[0].geom);

      if (!parkingId) {
        throw new Error('No parking found near destination');
      }

      const parkingGeomResult = await this.dataSource.query<GeomResult[]>(
        'SELECT ST_SetSRID(centroid, 4326) as geom FROM campus_map.places WHERE id = $1',
        [parkingId],
      );

      if (!parkingGeomResult[0]) {
        throw new Error('Parking place not found');
      }

      verticeDestino = await this.getNearestVertice(parkingGeomResult[0].geom);
    } else {
      // Para caminar (1) o bicicleta (3), ir directo al lugar
      verticeDestino = await this.getNearestVertice(placeGeomResult[0].geom);
    }

    const verticeOrigen = await this.getNearestVertice(point);
    const routeSteps = await this.getRouteInstructions(
      verticeOrigen,
      verticeDestino,
      mode,
    );

    return RoutingMapper.toFeatureCollection(routeSteps, 'Navigation Route');
  }

  async getParkingNearest(point: string): Promise<number | null> {
    const result = await this.dataSource.query<IdResult[]>(
      `SELECT id FROM campus_map.find_nearest_from_select(
        $1,
        'SELECT id, centroid as geom FROM campus_map.places WHERE type_id = 2'
      )`,
      [point],
    );
    return result[0]?.id ?? null;
  }

  async getNearestVertice(point: string): Promise<number> {
    const result = await this.dataSource.query<IdResult[]>(
      `SELECT id FROM campus_map.find_nearest_from_select(
        $1,
        'SELECT id, geom FROM campus_map.vertices'
      )`,
      [point],
    );

    if (!result[0]) {
      throw new Error('No nearest vertex found');
    }

    return result[0].id;
  }

  private parseGeometry<T>(value: unknown): T {
    return (typeof value === 'string' ? JSON.parse(value) : value) as T;
  }

  async getRouteInstructions(
    startNode: number,
    endNode: number,
    mode: number,
  ): Promise<RouteDetails[]> {
    const result = await this.dataSource.query<RouteStepRaw[]>(
      `SELECT 
        step,
        instruction_start as instruction,
        ST_AsGeoJSON(start_point)::json as start_point,
        next_instruction,
        ST_AsGeoJSON(end_point)::json as end_point,
        ST_AsGeoJSON(geom)::json as geom,
        total_distance_m as cost_m
      FROM campus_map.get_route_instructions($1, $2, $3)`,
      [startNode, endNode, mode],
    );

    return result.map((row, index) => {
      const routeDetail = new RouteDetails();
      routeDetail.id = (index + 1).toString();
      routeDetail.step = row.step;
      routeDetail.start_point = this.parseGeometry(row.start_point);
      routeDetail.end_point = this.parseGeometry(row.end_point);
      routeDetail.geom = this.parseGeometry(row.geom);
      routeDetail.instruction = row.instruction;
      routeDetail.next_instruction = row.next_instruction;
      routeDetail.cost_m =
        row.cost_m != null ? parseFloat(row.cost_m.toString()) : 0;
      return routeDetail;
    });
  }
}
