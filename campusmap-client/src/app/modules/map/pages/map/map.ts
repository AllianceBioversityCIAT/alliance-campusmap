import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLoad } from './components/map-load/map-load';
import { SearchBar } from './components/search-bar/search-bar';
import { FilterControls } from './components/filter-controls/filter-controls';
import { InformationPopUp } from './components/information-pop-up/information-pop-up';
import { InformationPopUpParking } from './components/information-pop-up-parking/information-pop-up-parking';
import { TransportButtonSelector } from './components/transport-button-selector/transport-button-selector';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MapLoad, SearchBar, FilterControls, InformationPopUp, InformationPopUpParking, TransportButtonSelector],
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class Map {
  @ViewChild(InformationPopUp) informationPopUp!: InformationPopUp;

  selectedPlace = {
    name: '',
    type: '',
    imageUrl: '',
    isVisible: false
  };

  isTransportSelectorVisible = false;

  onPlaceSelected(place: { name: string; type: string; imageUrl: string }): void {
    this.selectedPlace = {
      ...place,
      isVisible: true
    };
  }

  onShowTransportSelector(): void {
    this.isTransportSelectorVisible = true;
  }

  onMapClicked(): void {
    this.selectedPlace.isVisible = false;
    this.isTransportSelectorVisible = false;
  }
}
