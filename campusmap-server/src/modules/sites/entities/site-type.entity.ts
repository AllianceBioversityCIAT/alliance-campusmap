import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

/**
 * SiteTypes Entity
 *
 * Represents a category or classification type for sites.
 * Examples: "bathroom", "assembly-point", "parking", "emergency-exit".
 * Used to filter and organize specific points of interest on the campus map.
 *
 * @entity site_types
 * @schema campus_map
 */
@Entity({ name: 'site_types', schema: 'campus_map' })
@Unique(['code'])
export class SiteTypes {
  /** Unique identifier for the site type */
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  /** Unique code identifying the site type (e.g., "bathroom", "assembly-point") */
  @Column({ type: 'varchar', length: 50 })
  code: string;
}
