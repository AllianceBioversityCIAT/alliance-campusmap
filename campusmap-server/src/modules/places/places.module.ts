import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { TypePlace } from './entities/type-place.entity';
import { Unit } from './entities/unity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, Unit, TypePlace])],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
