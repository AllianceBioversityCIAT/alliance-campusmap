import { Component, viewChild, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLoad } from './components/map-load/map-load';
import { SearchBar } from './components/search-bar/search-bar';
import { FilterControls } from './components/filter-controls/filter-controls';
import { InformationPopUp } from './components/information-pop-up/information-pop-up';
import { InformationPopUpParking } from './components/information-pop-up-parking/information-pop-up-parking';
import { TransportButtonSelector } from './components/transport-button-selector/transport-button-selector';
import { SosButton } from './components/sos-button/sos-button';
import { LocationPermissionPopup } from './components/location-permission-popup/location-permission-popup';
import { LocationButton } from './components/location-button/location-button';
import { PlaceFeature } from '../../../../core/models/place.model';
import { GeolocationService } from '../../../../core/services/geolocation.service';
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
    SosButton,
    LocationPermissionPopup,
    LocationButton
  ],
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Map {
  mapLoad = viewChild.required<MapLoad>(MapLoad);
  informationPopUp = viewChild.required<InformationPopUp>(InformationPopUp);

  private readonly geolocationService = inject(GeolocationService);

  selectedPlace = signal({
    name: '',
    type: '',
    imageUrl: '',
    isVisible: false
  });

  isTransportSelectorVisible = signal(false);
  showLocationPermissionPopup = signal(true);

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

  onLocationPermissionAccepted(): void {
    this.showLocationPermissionPopup.set(false);
    this.mapLoad()?.enableLocationTracking();
  }

  onLocationPermissionDeclined(): void {
    this.showLocationPermissionPopup.set(false);
  }

  onCenterOnUserLocation(): void {
    const position = this.geolocationService.currentPosition();
    if (position) {
      this.mapLoad()?.flyToLocation(position.longitude, position.latitude, 19);
    }
  }
}
