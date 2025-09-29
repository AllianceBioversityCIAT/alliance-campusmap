import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/welcome/welcome').then(m => m.Welcome) },
  { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome').then(m => m.Welcome) },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'map', loadComponent: () => import('./pages/map/map').then(m => m.Map) }
];
