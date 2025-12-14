import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { Vertice } from '../routing/entities/vertice.entity';
import { Place } from '../places/entities/place.entity';
import { Site } from './entities/site.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteTypes } from './entities/site-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Site, SiteTypes, Vertice, Place])],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
