import { Component } from '@angular/core';
import { MapLoad } from './components/map-load/map-load';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapLoad],
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class Map {}
