import { Component } from '@angular/core';
import { MapLoad } from './components/map-load/map-load';
import { SearchBar } from './components/search-bar/search-bar';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapLoad, SearchBar],
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class Map {}
