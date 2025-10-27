import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { TypePlace } from './entities/type-place.entity';
import { GroupPlace } from './entities/group-place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, GroupPlace, TypePlace])],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
