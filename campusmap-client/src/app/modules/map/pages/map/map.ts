import { Component, viewChild, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLoad } from './components/map-load/map-load';
import { SearchBar } from './components/search-bar/search-bar';
import { FilterControls } from './components/filter-controls/filter-controls';
import { InformationPopUp } from './components/information-pop-up/information-pop-up';
import { InformationPopUpParking } from './components/information-pop-up-parking/information-pop-up-parking';
import { TransportButtonSelector } from './components/transport-button-selector/transport-button-selector';
import { SosButton } from './components/sos-button/sos-button';
import { PlaceFeature } from '../../../../core/models/place.model';
@Component({
  selector: 'app-map',
  imports: [
    CommonModule,
    MapLoad,
    SearchBar,
    FilterControls,
    InformationPopUp,
    InformationPopUpParking,
    TransportButtonSelector,
    SosButton
  ],
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Map {
  mapLoad = viewChild.required<MapLoad>(MapLoad);
  informationPopUp = viewChild.required<InformationPopUp>(InformationPopUp);

  selectedPlace = signal({
    name: '',
    type: '',
    imageUrl: '',
    isVisible: false
  });

  isTransportSelectorVisible = signal(false);

  onPlaceSelected(place: { name: string; type: string; imageUrl: string }): void {
    this.selectedPlace.set({
      ...place,
      isVisible: true
    });
    // Hide transport selector when a new place is selected
    this.isTransportSelectorVisible.set(false);
  }

  onShowTransportSelector(): void {
    this.isTransportSelectorVisible.set(true);
  }

  onVisibleChange(visible: boolean): void {
    this.selectedPlace.update(place => ({ ...place, isVisible: visible }));
  }

  onMapClicked(): void {
    this.selectedPlace.update(place => ({ ...place, isVisible: false }));
    this.isTransportSelectorVisible.set(false);
  }

  onLocationSelected(place: PlaceFeature): void {
    // Navigate to the centroid coordinates
    if (place.properties?.centroid?.coordinates) {
      const coords = place.properties.centroid.coordinates;
      // Ensure coordinates are a point [lng, lat]
      if (
        Array.isArray(coords) &&
        coords.length >= 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number'
      ) {
        const [lng, lat] = coords as [number, number];
        this.mapLoad()?.flyToLocation(lng, lat);
        console.log('Navigating to:', place.properties.name, [lng, lat]);
      }
    }
  }
}
