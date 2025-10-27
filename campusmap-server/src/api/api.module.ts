import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { PlacesModule } from 'src/modules/places/places.module';

@Module({
  imports: [PlacesModule],
  controllers: [ApiController],
})
export class ApiModule {}
