import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Geometry } from 'geojson';
import { PlaceTypes } from './place-type.entity';
import { Unit } from './units.entity';
import { PlaceImg } from './place-img.entity';

/**
 * ColorEnum
 *
 * Enumeration of colors used to categorize places on the campus map.
 * Used for visual differentiation in the UI.
 */
export enum ColorEnum {
  BLUE_GREEN = 'blue/green',
  BLUE = 'blue',
  GREEN = 'green',
  ORANGE = 'orange',
  YELLOW = 'yellow',
}

/**
 * Place Entity
 *
 * Represents a physical location or area on the Palmira campus.
 * Stores geographic data (polygon area and centroid point),
 * metadata (name, type, color, icon), and relationships to units and images.
 *
 * @entity places
 * @schema campus_map
 */
@Entity({ name: 'places', schema: 'campus_map' })
export class Place {
  /** Unique identifier for the place */
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  /** Name of the place (e.g., "Building A", "Central Park") */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  /** Polygon geometry representing the physical area of the place (SRID 4326 - WGS84) */
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
    nullable: false,
  })
  area: Geometry;

  /** Point geometry representing the centroid of the place (SRID 4326 - WGS84) */
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  centroid: Geometry;

  /** Foreign key to the place type */
  @Column({
    type: 'integer',
    name: 'type_id',
    nullable: true,
  })
  typeId: number;

  /** Icon identifier or path for displaying the place on the map */
  @Column({
    type: 'varchar',
    name: 'icon',
    length: 100,
    nullable: true,
  })
  icon: string;

  /** Color category for visual representation on the map */
  @Column({
    type: 'enum',
    enum: ColorEnum,
    enumName: 'color_enum',
    nullable: true,
  })
  color: ColorEnum;

  /** Type classification of the place (building, parking, etc.) */
  @ManyToOne(() => PlaceTypes, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type: PlaceTypes;

  /** Associated images for the place */
  @OneToMany(() => PlaceImg, (PlaceImg) => PlaceImg.place)
  images: PlaceImg[];

  /** Units or departments located in this place */
  @OneToMany(() => Unit, (unit) => unit.place)
  units: Unit[];
}
