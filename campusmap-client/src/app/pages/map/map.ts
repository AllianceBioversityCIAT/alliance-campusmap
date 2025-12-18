import {
  Component,
  viewChild,
  signal,
  computed,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { LanguageService } from '@shared/services/language.service';
interface PlacePopupData {
  id: number | null;
  name: string;
  type: string;
  displayType?: string;
  imageUrl: string;
  images: { id: number; img: string }[];
  isVisible: boolean;
}

interface PlaceInput {
  id: number;
  name: string;
  type: string;
  displayType?: string;
  imageUrl: string;
  images?: { id: number; img: string }[];
}

@Component({
  selector: 'app-map',
  imports: [
    CommonModule,
    NgOptimizedImage,
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
export class Map implements OnInit, OnDestroy {
  mapLoad = viewChild.required<MapLoad>(MapLoad);
  informationPopUp = viewChild.required<InformationPopUp>(InformationPopUp);

  private readonly geolocationService = inject(GeolocationService);
  private readonly languageService = inject(LanguageService);

  selectedPlace = signal<PlacePopupData>({
    id: null,
    name: '',
    type: '',
    imageUrl: '',
    images: [],
    isVisible: false
  });

  isTransportSelectorVisible = signal(false);
  language = toSignal(this.languageService.currentLanguage$, {
    initialValue: this.languageService.getCurrentLanguage()
  });

  logoPath = computed(() =>
    this.language() === 'es'
      ? 'assets/images/alianza_font_logo.svg'
      : 'assets/images/alliance_font_logo.svg'
  );

  logoAlt = computed(() => (this.language() === 'es' ? 'Logo de Alianza' : 'Alliance logo'));

  ngOnInit(): void {
    // Automatically request permission and start GPS tracking when entering /map
    this.geolocationService.requestPermissionAndStartTracking();
  }

  ngOnDestroy(): void {
    // Clean up: stop GPS tracking when leaving /map
    this.geolocationService.stopTracking();
  }

  onPlaceSelected(place: PlaceInput): void {
    const processImageUrl = (url: string): string => {
      if (url.startsWith('http')) {
        return url;
      }
      return 'https://campusmap-file-storage.s3.us-east-1.amazonaws.com/' + url.replace(/^\//, '');
    };

    const processedImageUrl = place.imageUrl ? processImageUrl(place.imageUrl) : '';
    const processedImages =
      place.images?.map((imgObj: { id: number; img: string }) => ({
        id: imgObj.id,
        img: processImageUrl(imgObj.img)
      })) ?? [];

    // For buildings, prefer showing the gallery (images array) when present; for parking, show the first image.
    const imageUrlForPopup =
      processedImageUrl || (place.type === 'parking' ? processedImages[0]?.img || '' : '');

    this.selectedPlace.set({
      ...place,
      displayType: place.displayType || place.type,
      images: processedImages,
      imageUrl: imageUrlForPopup,
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
    this.mapLoad()?.clearRoute();
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

  async onRouteSelected(event: { mode: 1 | 2 }): Promise<void> {
    const placeId = this.selectedPlace().id;

    if (!placeId) {
      console.warn('No place selected to route to');
      return;
    }

    await this.mapLoad()?.routeToPlace(placeId, event.mode);
    this.isTransportSelectorVisible.set(false);
  }

  async onSosClicked(): Promise<void> {
    // Hide any open popups before centering on SOS destination
    this.onMapClicked();
    await this.mapLoad()?.showNearestAssemblyPoint();
  }
}
