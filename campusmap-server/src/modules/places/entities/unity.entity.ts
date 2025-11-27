import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Place } from './place.entity';

/**
 * Unit Entity
 *
 * Represents an organizational unit, department, or office located within a place.
 * Examples: "Human Resources", "IT Department", "Laboratory 3".
 * Multiple units can be associated with a single place (building).
 *
 * @entity unit
 * @schema campus_map
 */
@Entity({ name: 'unit', schema: 'campus_map' })
export class Unit {
  /** Unique identifier for the unit */
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  /** Name of the unit or department */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  /** The place (building) where this unit is located */
  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
