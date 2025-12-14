import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Place } from './place.entity';

/**
 * PlaceTypes Entity
 *
 * Represents a category or classification type for places.
 * Examples: "building", "parking", "green-area", "sports-facility".
 * Used to filter and organize places on the campus map.
 *
 * @entity place_types
 * @schema campus_map
 */
@Entity({ name: 'place_types', schema: 'campus_map' })
export class PlaceTypes {
  /** Unique identifier for the place type */
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  /** Unique code identifying the type (e.g., "building", "parking") */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  code: string;

  /** All places associated with this type */
  @OneToMany(() => Place, (place) => place.type)
  places: Place[];
}
