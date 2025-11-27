import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { PlacesMapper } from './mappers/places.mapper';
import { FeatureCollectionDto } from '../../common/dto/geojson.dto';
import { PlacePropertiesDto } from './dtos/places.dto';

/**
 * Service for handling place data operations.
 * Provides methods to retrieve all places or filter places by type code or search term.
 */
@Injectable()
export class PlacesService {
  /**
   * Constructor for PlacesService.
   * @param placeRepository Repository for Place entity.
   */
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  /**
   * Retrieves all places from the database, optionally filtered by a search term.
   * Includes related type, units, and images entities.
   * @param search Optional search term to filter places by name.
   * @returns {Promise<FeatureCollectionDto<PlacePropertiesDto>>} FeatureCollection with all or filtered places.
   */
  async getAllPlaces(
    search?: string,
  ): Promise<FeatureCollectionDto<PlacePropertiesDto>> {
    const places = await this.placeRepository.find({
      relations: ['type', 'units', 'images'],
      where: [search ? { name: ILike(`%${search}%`) } : {}],
    });
    return PlacesMapper.toFeatureCollection(places, 'All Places');
  }

  /**
   * Retrieves places filtered by the given type code.
   * Includes related type, units, and images entities.
   * @param code Type code to filter places (e.g. "building", "parking").
   * @returns {Promise<FeatureCollectionDto<PlacePropertiesDto>>} FeatureCollection with filtered places.
   */
  async getPlacesByTypeCode(
    code: string,
  ): Promise<FeatureCollectionDto<PlacePropertiesDto>> {
    const places = await this.placeRepository.find({
      where: { type: { code } },
      relations: ['type', 'units', 'images'],
    });
    return PlacesMapper.toFeatureCollection(places, `Places of type ${code}`);
  }
}
