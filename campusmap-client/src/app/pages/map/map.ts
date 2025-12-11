import { Component, viewChild, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLoad } from './components/map-load/map-load';
import { SearchBar } from './components/search-bar/search-bar';
import { InformationPopUp } from './components/information-pop-up/information-pop-up';
import { InformationPopUpParking } from './components/information-pop-up-parking/information-pop-up-parking';
import { TransportButtonSelector } from './components/transport-button-selector/transport-button-selector';
import { SosButton } from './components/sos-button/sos-button';
import { LocationButton } from './components/location-button/location-button';
import { NorthButtonComponent } from './components/north-button/north-button';
import { PlaceFeature } from '@shared/types/place.model';
import { GeolocationService } from '@shared/services/geolocation.service';
interface PlacePopupData {
  name: string;
  type: string;
  imageUrl: string;
  images: { id: number; img: string }[];
  isVisible: boolean;
}

interface PlaceInput {
  name: string;
  type: string;
  imageUrl: string;
  images?: { id: number; img: string }[];
}

@Component({
  selector: 'app-map',
  imports: [
    CommonModule,
    MapLoad,
    SearchBar,
    InformationPopUp,
    InformationPopUpParking,
    TransportButtonSelector,
    SosButton,
    LocationButton,
    NorthButtonComponent
  ],
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Map {
  mapLoad = viewChild.required<MapLoad>(MapLoad);
  informationPopUp = viewChild.required<InformationPopUp>(InformationPopUp);

  private readonly geolocationService = inject(GeolocationService);

  selectedPlace = signal<PlacePopupData>({
    name: '',
    type: '',
    imageUrl: '',
    images: [],
    isVisible: false
  });

  isTransportSelectorVisible = signal<boolean>(false);

  onPlaceSelected(place: PlaceInput): void {
    this.selectedPlace.set({
      ...place,
      images:
        place.images?.map(imgObj => ({
          id: imgObj.id,
          img: imgObj.img.startsWith('http')
            ? imgObj.img
            : 'https://1hz14f3vx1.execute-api.us-east-1.amazonaws.com/' +
              imgObj.img.replace(/^\//, '')
        })) ?? [],
      isVisible: true
    });
    this.isTransportSelectorVisible.set(false);
  }

  onShowTransportSelector(): void {
    this.isTransportSelectorVisible.set(true);
  }

  onVisibleChange(visible: boolean): void {
    this.selectedPlace.update((place: PlacePopupData) => ({
      ...place,
      isVisible: visible
    }));
  }

  onMapClicked(): void {
    this.selectedPlace.update((place: PlacePopupData) => ({
      ...place,
      isVisible: false
    }));
    this.isTransportSelectorVisible.set(false);
  }

  onLocationSelected(place: PlaceFeature): void {
    if (place.properties?.centroid?.coordinates) {
      const coords = place.properties.centroid.coordinates;
      if (
        Array.isArray(coords) &&
        coords.length >= 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number'
      ) {
        const [lng, lat] = coords as [number, number];
        this.mapLoad()?.flyToLocation(lng, lat);
      }
    }
  }

  async onCenterOnUserLocation(): Promise<void> {
    if (!this.geolocationService.isTracking()) {
      await this.mapLoad()?.enableLocationTracking();
    }
    const position = this.geolocationService.currentPosition();
    if (position) {
      this.mapLoad()?.flyToLocation(position.longitude, position.latitude, 19);
    }
  }

  onResetNorth(): void {
    this.mapLoad()?.resetBearing();
  }
}
