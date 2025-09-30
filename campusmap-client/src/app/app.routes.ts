import { Routes } from '@angular/router';

export const routes: Routes = [
P2-'add-homePage'

  {
    path: '',
    loadComponent: () => import('./modules/auth/pages/welcome/welcome').then(m => m.Welcome)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./modules/auth/pages/welcome/welcome').then(m => m.Welcome)
  },
  {
    path: 'home',
    loadComponent: () => import('./modules/auth/pages/home/home').then(m => m.Home)
  },
  {
    path: 'map',
    loadComponent: () => import('./modules/map/pages/map/map').then(m => m.Map)
  }

];
