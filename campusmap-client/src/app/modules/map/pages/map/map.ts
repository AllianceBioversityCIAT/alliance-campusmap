import {
  Component,
  viewChild,
  signal,
  ChangeDetectionStrategy,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLoad } from './components/map-load/map-load';
import { SearchBar } from './components/search-bar/search-bar';
import { FilterControls } from './components/filter-controls/filter-controls';
import { InformationPopUp } from './components/information-pop-up/information-pop-up';
import { InformationPopUpParking } from './components/information-pop-up-parking/information-pop-up-parking';
import { TransportButtonSelector } from './components/transport-button-selector/transport-button-selector';
import { SosButton } from './components/sos-button/sos-button';
import { LocationButton } from './components/location-button/location-button';
import { PlaceFeature, FeatureCollection } from '../../../../core/models/place.model';
import { GeolocationService } from '../../../../core/services/geolocation.service';
import { Api } from '../../../../core/services/api';
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
    LocationButton
  ],
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Map implements OnInit {
  private readonly api: Api = inject(Api);
  // Encuentra el assemblyPoint más cercano y hace flyTo
  async onSosClicked(): Promise<void> {
    const userPosition = this.geolocationService.currentPosition();
    if (!userPosition) return;
    // Obtener todos los assembly points
    this.api.getSitesByType('assembly-point').subscribe({
      next: (data: FeatureCollection) => {
        if (!data?.features?.length) return;
        let minDistance = Number.POSITIVE_INFINITY;
        let nearest: { lng: number; lat: number } | null = null;
        for (const feature of data.features) {
          const coords = feature.geometry?.coordinates;
          if (Array.isArray(coords) && coords.length >= 2) {
            const [lng, lat] = coords as [number, number];
            const dist = this.geolocationService.calculateDistance(
              userPosition.latitude,
              userPosition.longitude,
              lat,
              lng
            );
            if (dist < minDistance) {
              minDistance = dist;
              nearest = { lng, lat };
            }
          }
        }
        if (nearest) {
          this.mapLoad()?.flyToLocation(nearest.lng, nearest.lat, 19);
        }
      }
    });
  }
  // Cierra el popup al abrir el filtro
  onOpenFilter(): void {
    this.selectedPlace.update(place => ({
      ...place,
      isVisible: false
    }));
    this.isTransportSelectorVisible.set(false);
  }
  mapLoad = viewChild.required<MapLoad>(MapLoad);
  informationPopUp = viewChild.required<InformationPopUp>(InformationPopUp);
  filterControls = viewChild.required<FilterControls>(FilterControls);

  private readonly geolocationService = inject(GeolocationService);

  selectedPlace = signal<{
    name: string;
    type: string;
    imageUrl: string;
    images: { id: number; img: string }[];
    isVisible: boolean;
  }>({
    name: '',
    type: '',
    imageUrl: '',
    images: [],
    isVisible: false
  });

  isTransportSelectorVisible = signal(false);
  ngOnInit(): void {
    // Cargar ubicación automáticamente al entrar en /map
    this.onCenterOnUserLocation();
  }

  onPlaceSelected(place: {
    name: string;
    type: string;
    imageUrl: string;
    images?: { id: number; img: string }[];
  }): void {
    // Convert image path to absolute if needed
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
    // Hide transport selector when new place selected
    this.isTransportSelectorVisible.set(false);
  }

  onShowTransportSelector(): void {
    this.isTransportSelectorVisible.set(true);
  }

  onVisibleChange(visible: boolean): void {
    this.selectedPlace.update(place => ({
      ...place,
      isVisible: visible
    }));
  }

  onMapClicked(): void {
    this.selectedPlace.update(place => ({
      ...place,
      isVisible: false
    }));
    this.isTransportSelectorVisible.set(false);
    // Cierra el filtro si está abierto
    this.filterControls()?.close();
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
    // Check if tracking is enabled
    if (!this.geolocationService.isTracking()) {
      await this.mapLoad()?.enableLocationTracking();
    }
    // Center map on user location
    const position = this.geolocationService.currentPosition();
    if (position) {
      this.mapLoad()?.flyToLocation(position.longitude, position.latitude, 19);
    }
  }
}
