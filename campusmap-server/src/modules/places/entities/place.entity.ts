import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Geometry } from 'geojson';
import { TypePlace } from './type-place.entity';
import { Unit } from './unity.entity';

export enum ColorEnum {
  BLUE_GREEN = 'blue/green',
  BLUE = 'blue',
  GREEN = 'green',
  ORANGE = 'orange',
  YELLOW = 'yellow',
}

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
    name: 'type_id',
    nullable: true,
  })
  typeId: number;

  @Column({
    type: 'varchar',
    name: 'icon',
    length: 100,
    nullable: true,
  })
  icon: string;

  @Column({
    type: 'enum',
    enum: ColorEnum,
    enumName: 'color_enum',
    nullable: true,
  })
  color: ColorEnum;

  @ManyToOne(() => TypePlace, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type: TypePlace;

  @OneToMany(() => Unit, (unit) => unit.place)
  units: Unit[];
}
