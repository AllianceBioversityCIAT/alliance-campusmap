import { Module } from '@nestjs/common';
import { PlacesModule } from 'src/modules/places/places.module';

@Module({
  imports: [PlacesModule],
  controllers: [],
})
export class ApiModule {}
