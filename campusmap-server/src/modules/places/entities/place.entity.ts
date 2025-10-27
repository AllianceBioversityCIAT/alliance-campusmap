import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Geometry } from 'geojson';
import { GroupPlace } from './group-place.entity';
import { TypePlace } from './type-place.entity';

@Entity({ name: 'place', schema: 'campus_map' })
export class Place {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
    nullable: false,
  })
  area: Geometry;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  centroid: Geometry;

  @Column({
    type: 'integer',
    name: 'group_id',
    nullable: true,
  })
  groupId: number;

  @Column({
    type: 'integer',
    name: 'type_id',
    nullable: true,
  })
  typeId: number;

  @Column({
    type: 'text',
    name: 'image_url',
    nullable: true,
  })
  imageUrl: string;

  @ManyToOne(() => GroupPlace, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: GroupPlace;

  @ManyToOne(() => TypePlace, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type: TypePlace;
}
