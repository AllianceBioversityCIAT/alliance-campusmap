import { Component } from '@angular/core';
import { MapLoad } from './components/map-load/map-load';
import { SearchBar } from './components/search-bar/search-bar';
import { FilterControls } from './components/filter-controls/filter-controls';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapLoad, SearchBar, FilterControls],
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class Map {}
