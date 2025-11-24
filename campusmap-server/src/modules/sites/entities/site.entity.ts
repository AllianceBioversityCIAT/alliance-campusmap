import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { Vertice } from 'src/modules/routing/entities/vertice.entity';
import { TypeSites } from './type_site.entity';
import { Place } from 'src/modules/places/entities/place.entity';

@Entity({ name: 'site', schema: 'campus_map' })
export class Site {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coords: Point;

  @ManyToOne(() => TypeSites, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type: TypeSites;

  @ManyToOne(() => Vertice, { nullable: true })
  @JoinColumn({ name: 'vertice_id' })
  vertice: Vertice;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  icon: string;
}
