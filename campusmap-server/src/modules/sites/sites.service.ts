import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './entities/site.entity';

/**
 * Service for handling site data operations.
 * Provides methods to retrieve all sites or filter sites by type code.
 */
@Injectable()
export class SitesService {
  /**
   * Constructor for SitesService.
   * @param siteRepository Repository for Site entity.
   */
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
  ) {}

  /**
   * Retrieves all sites from the database, including related place and type entities.
   * @returns {Promise<Site[]>} Array of all Site entities.
   */
  async getAllSites(): Promise<Site[]> {
    return this.siteRepository.find({
      relations: ['place', 'type'],
    });
  }

  /**
   * Retrieves sites filtered by the given type code.
   * Includes related place and type entities.
   * @param code Type code to filter sites (e.g. "park", "monument").
   * @returns {Promise<Site[]>} Array of Site entities matching the type code.
   */
  async getSiteByTypeCode(code: string): Promise<Site[]> {
    return this.siteRepository.find({
      where: { type: { code } },
      relations: ['place', 'type'],
    });
  }
}
