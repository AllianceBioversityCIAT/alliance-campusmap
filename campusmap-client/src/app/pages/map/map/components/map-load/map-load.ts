import {
  AfterViewInit,
  Component,
  OnDestroy,
  ElementRef,
  viewChild,
  inject,
  output,
  ChangeDetectionStrategy,
  effect
} from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Api } from '@shared/services/api';
import { PlaceFeature, FeatureCollection } from '@shared/types/place.model';
import { MapFilterService } from '@shared/services/map-filter.service';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationService, UserGeolocationPosition } from '@shared/services/geolocation.service';
import { MapMarkerService } from '@shared/services/map-marker.service';
import { UserMarkerService } from '@shared/services/user-marker.service';
import { DeviceOrientationService } from '@shared/services/device-orientation.service';

@Component({
  selector: 'app-map-load',
  imports: [],
  templateUrl: './map-load.html',
  styleUrls: ['./map-load.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapLoad implements AfterViewInit, OnDestroy {
  //Output event when a place is selected
  placeSelected = output<{
    name: string;
    type: string;
    imageUrl: string;
    images?: { id: number; img: string }[];
  }>();
  //Output event when the map is clicked
  mapClicked = output<void>();

  constructor() {
    // React to geolocation position changes
    effect(() => {
      const position = this.geolocationService.currentPosition();
      if (position && this.map) {
        this.handlePositionUpdate(position);
      }
    });

    // React to geolocation errors
    effect(() => {
      const error = this.geolocationService.error();
      if (error) {
        console.error('Geolocation error:', error);
      }
    });
  }

  //Map instances and controls
  private map!: maplibregl.Map;

  //Reference to the map container in the template
  mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  //Services
  private readonly api = inject(Api);
  private readonly mapFilterService = inject(MapFilterService);
  private readonly translate = inject(TranslateService);
  private readonly geolocationService = inject(GeolocationService);
  private readonly mapMarkerService = inject(MapMarkerService);
  private readonly userMarkerService = inject(UserMarkerService);
  private readonly deviceOrientationService = inject(DeviceOrientationService);

  ngAfterViewInit(): void {
    this.initializeMap();
    this.setupMapControls();
    this.setupMapEventHandlers();
  }

  private initializeMap(): void {
    this.map = new maplibregl.Map({
      // Use the element reference instead of the global id to avoid "Container 'map' not found" errors
      container: this.mapContainer()?.nativeElement ?? 'map',
      style:
        'https://api.maptiler.com/maps/019a0d96-0c62-770e-82b8-be41643f8563/style.json?key=FZvbkS3DkmF7kMOIUmLZ', // map style
      center: [-76.35655, 3.50442], // [longitude, latitude]
      zoom: 17,
      minZoom: 15,
      maxZoom: 20,
      bearing: 163, // inclination
      pitch: 0
    });
  }

  private setupMapControls(): void {
    // Navigation control (only rotation)
    this.map.addControl(new maplibregl.NavigationControl({ showZoom: false }), 'top-right');
  }

  private setupMapEventHandlers(): void {
    //Wait for the map to load to begin user tracking
    this.map.on('load', () => {
      // Don't automatically track user - wait for permission popup
      this.loadPlaces();

      // Subscribe to filter changes
      this.mapFilterService.filter$.subscribe(filterKey => {
        this.loadPlaces(filterKey);
      });

      // Subscribe to language changes
      this.translate.onLangChange.subscribe(() => {
        this.mapMarkerService.updateAllLabelTranslations();
      });
    });

    //Emit event when map is clicked
    this.map.on('click', () => {
      this.mapClicked.emit();
    });

    //Listen to zoom changes to update label visibility
    this.map.on('zoom', () => {
      this.mapMarkerService.updateAllLabelVisibility();
    });
  }

  //Update user marker on map with position from geolocation service
  private handlePositionUpdate(position: UserGeolocationPosition): void {
    if (this.userMarkerService.exists()) {
      this.userMarkerService.updatePosition(position.longitude, position.latitude);
    } else {
      this.userMarkerService.createUserMarker(this.map, position.longitude, position.latitude);
      this.setupDeviceOrientation();
    }
  }

  // Public method to enable location tracking (called after user grants permission)
  async enableLocationTracking(): Promise<void> {
    const success = await this.geolocationService.requestPermissionAndStartTracking();
    if (!success) {
      console.error('Failed to enable location tracking');
    }
  }

  //Setup device orientation tracking
  private async setupDeviceOrientation(): Promise<void> {
    const granted = await this.deviceOrientationService.requestPermission();
    if (granted) {
      this.deviceOrientationService.startTracking(heading => {
        this.userMarkerService.updateOrientation(heading);
      });
    }
  }

  //Load places from API and display centroids on map
  private loadPlaces(filterKey: string | null = null): void {
    this.mapMarkerService.clearMarkers();

    if (filterKey) {
      this.loadFilteredPlaces(filterKey);
      return;
    }

    this.loadAllPlaces();
  }

  private loadFilteredPlaces(filterKey: string): void {
    this.api.getPlacesByType(filterKey).subscribe({
      next: (data: FeatureCollection) => {
        if (data?.features && Array.isArray(data.features)) {
          this.addMarkersToMap(data.features);
        }
      },
      error: error => {
        console.error('Error loading places:', error);
      }
    });
  }

  private loadAllPlaces(): void {
    this.api.getAllPlaces().subscribe({
      next: (data: FeatureCollection) => {
        if (data?.features && Array.isArray(data.features)) {
          this.addMarkersToMap(data.features);
        }
      },
      error: error => {
        console.error('Error loading places:', error);
      }
    });

    this.api.getSitesByType('assembly-point').subscribe({
      next: (data: FeatureCollection) => {
        if (data?.features && Array.isArray(data.features)) {
          this.addMarkersToMap(data.features);
        }
      },
      error: error => {
        console.error('Error loading assembly points:', error);
      }
    });
  }

  //Add markers to the map
  private addMarkersToMap(features: PlaceFeature[]): void {
    for (const feature of features) {
      this.mapMarkerService.createPlaceMarker(this.map, feature, properties => {
        this.handleMarkerClick(properties);
      });
    }
  }

  // Handle marker click
  private handleMarkerClick(properties: PlaceFeature['properties']): void {
    const rawType = (properties.typeCode || properties.type || '').toString().toLowerCase().trim();

    if (rawType === 'building' || rawType === 'parking') {
      this.placeSelected.emit({
        name: properties.name,
        type: rawType,
        imageUrl: properties.imageUrl || '',
        images: (properties.images || []).map(imgObj => ({
          id: imgObj.id,
          img: imgObj.img
        }))
      });
    }
  }

  //Navigate to specific coordinates
  flyToLocation(lng: number, lat: number, zoom = 19): void {
    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom: zoom,
        duration: 1500,
        essential: true
      });
    }
  }

  ngOnDestroy(): void {
    this.geolocationService.stopTracking();
    this.deviceOrientationService.stopTracking();
    this.userMarkerService.remove();
    this.mapMarkerService.clearMarkers();

    if (this.map) {
      this.map.remove();
    }
  }
}
