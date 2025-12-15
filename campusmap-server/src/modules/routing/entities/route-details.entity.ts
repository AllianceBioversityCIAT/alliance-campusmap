import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { LineString, Point } from 'geojson';

@Entity({ name: 'route_details', schema: 'campus_map' })
export class RouteDetails {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'integer' })
  step: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  start_point: Point;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  end_point: Point;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineString',
    srid: 4326,
    nullable: true,
  })
  geom: LineString;

  @Column({ type: 'text', nullable: true })
  instruction: string;

  @Column({ type: 'text', nullable: true })
  next_instruction: string;

  @Column({ type: 'numeric', nullable: true })
  cost_m: number;
}
