import { Routes } from '@nestjs/core';
import { ApiModule } from './api/api.module';

export const routes: Routes = [
  {
    path: 'api',
    module: ApiModule,
  },
];
