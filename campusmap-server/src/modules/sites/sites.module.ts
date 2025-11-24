import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { Vertice } from '../routing/entities/vertice.entity';
import { Place } from '../places/entities/place.entity';
import { Site } from './entities/site.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeSites } from './entities/type_site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Site, TypeSites, Vertice, Place])],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
