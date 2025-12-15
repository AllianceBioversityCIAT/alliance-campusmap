import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RoutingController } from './routing.controller';
import { Place } from '../places/entities/place.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteDetails } from './entities/route-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, RouteDetails])],
  controllers: [RoutingController],
  providers: [RoutingService],
})
export class RoutingModule {}
