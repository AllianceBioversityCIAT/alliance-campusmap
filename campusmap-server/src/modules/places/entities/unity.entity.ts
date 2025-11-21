import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Place } from './place.entity';

@Entity({ name: 'unit', schema: 'campus_map' })
export class Unit {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
