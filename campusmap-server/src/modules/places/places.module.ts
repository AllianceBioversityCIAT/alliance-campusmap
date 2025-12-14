import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { PlaceTypes } from './entities/place-type.entity';
import { Unit } from './entities/units.entity';
import { PlaceImg } from './entities/place-img.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, Unit, PlaceTypes, PlaceImg])],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
