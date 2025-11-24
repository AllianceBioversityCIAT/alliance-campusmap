import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'type_sites', schema: 'campus_map' })
@Unique(['code'])
export class TypeSites {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;
}
