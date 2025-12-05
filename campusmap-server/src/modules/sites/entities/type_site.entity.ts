import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

/**
 * TypeSites Entity
 *
 * Represents a category or classification type for sites.
 * Examples: "bathroom", "assembly-point", "parking", "emergency-exit".
 * Used to filter and organize specific points of interest on the campus map.
 *
 * @entity type_sites
 * @schema campus_map
 */
@Entity({ name: 'type_sites', schema: 'campus_map' })
@Unique(['code'])
export class TypeSites {
  /** Unique identifier for the site type */
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  /** Unique code identifying the site type (e.g., "bathroom", "assembly-point") */
  @Column({ type: 'varchar', length: 50 })
  code: string;
}
