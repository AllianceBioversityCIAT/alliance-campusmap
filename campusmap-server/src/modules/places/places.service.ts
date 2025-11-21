import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { PlacesMapper } from './mappers/places.mapper';
import { FeatureCollectionDto } from '../../common/dto/geojson.dto';
import { PlacePropertiesDto } from './dtos/places.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  async getAllPlaces(search?:string): Promise<FeatureCollectionDto<PlacePropertiesDto>> {
    const places = await this.placeRepository.find({
      relations: ['type', 'units'],
      where: [search ? { name:  Like(`%${search}%`)} : {}],
      
    });
    return PlacesMapper.toFeatureCollection(places, 'All Places');
  }

  async getPlacesByTypeCode(
    code: string,
  ): Promise<FeatureCollectionDto<PlacePropertiesDto>> {
    const places = await this.placeRepository.find({
      where: { type: { code } },
      relations: ['type', 'units']
    });
    return PlacesMapper.toFeatureCollection(places, `Places of type ${code}`);
  }
}
