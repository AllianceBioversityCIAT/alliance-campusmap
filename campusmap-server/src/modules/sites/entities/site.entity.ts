import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { Vertice } from 'src/modules/routing/entities/vertice.entity';
import { SiteTypes } from './site-type.entity';
import { Place } from 'src/modules/places/entities/place.entity';

/**
 * Site Entity
 *
 * Represents a specific point of interest or location on the campus.
 * Sites are distinct from places - they represent specific points (bathrooms, assembly points,
 * parking spots, etc.) rather than larger areas. Each site has a point geometry and
 * can be associated with a place, type, and routing vertex.
 *
 * @entity sites
 * @schema campus_map
 */
@Entity({ name: 'sites', schema: 'campus_map' })
export class Site {
  /** Unique identifier for the site */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  /** Name of the site (e.g., "Bathroom Floor 2", "Emergency Exit A") */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /** The place (building) where this site is located */
  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  /** Point coordinates of the site location (SRID 4326 - WGS84) */
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coords: Point;

  /** Type classification of the site (bathroom, assembly-point, etc.) */
  @ManyToOne(() => SiteTypes, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type: SiteTypes;

  /** Associated routing vertex for pathfinding navigation */
  @ManyToOne(() => Vertice, { nullable: true })
  @JoinColumn({ name: 'vertice_id' })
  vertice: Vertice;

  /** Icon identifier or path for displaying the site on the map */
  @Column({ type: 'varchar', nullable: true, length: 100 })
  icon: string;
}
