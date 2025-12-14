import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Place } from './place.entity';

/**
 * PlaceImg Entity
 *
 * Represents an image associated with a place on the campus.
 * Stores the image filename or path for displaying visual references of places.
 * Multiple images can be associated with a single place.
 *
 * @entity place_img
 * @schema campus_map
 */
@Entity({ name: 'place_img', schema: 'campus_map' })
export class PlaceImg {
  /** Unique identifier for the image record */
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  /** Image filename or path (stored in the database) */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'img',
  })
  img: string;

  /** The place this image belongs to */
  @ManyToOne(() => Place, { nullable: false })
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
