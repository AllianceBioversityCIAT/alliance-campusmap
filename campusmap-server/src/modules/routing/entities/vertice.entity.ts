import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

@Entity({ name: 'vertice', schema: 'campus_map' })
export class Vertice {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column('double precision')
  x: number;

  @Column('double precision')
  y: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geometry: Point;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 3116,
  })
  geom_m: Point;
}
