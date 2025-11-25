import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Place } from './place.entity';

@Entity({ name: 'img_place', schema: 'campus_map' })
export class ImgPlace {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'img',
  })
  img: string;

  @ManyToOne(() => Place, { nullable: false })
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
