import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Place } from './place.entity';

@Entity({ name: 'group_places', schema: 'campus_map' })
export class GroupPlace {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  code: string;

  @OneToMany(() => Place, (place) => place.group)
  places: Place[];
}
