import { Component } from '@angular/core';
import { MapLoad } from './components/map-load/map-load';
import { SearchBar } from './components/search-bar/search-bar';
import { FilterControls } from './components/filter-controls/filter-controls';
import { InformationPopUp } from './components/information-pop-up/information-pop-up';
import { InformationPopUpParking } from './components/information-pop-up-parking/information-pop-up-parking';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapLoad, SearchBar, FilterControls, InformationPopUp, InformationPopUpParking],
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class Map {}
