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
import { Api } from '../../../../../../core/services/api';
import { PlaceFeature, FeatureCollection } from '../../../../../../core/models/place.model';
import { MapFilterService } from '../../../../../../core/services/map-filter.service';
import { TranslateService } from '@ngx-translate/core';
import {
  GeolocationService,
  UserGeolocationPosition
} from '../../../../../../core/services/geolocation.service';

@Component({
  selector: 'app-map-load',
  imports: [],
  templateUrl: './map-load.html',
  styleUrls: ['./map-load.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapLoad implements AfterViewInit, OnDestroy {
  //Output event when a place is selected
  placeSelected = output<{ name: string; type: string; imageUrl: string }>();
  //Output event when the map is clicked
  mapClicked = output<void>();

  constructor() {
    // React to geolocation position changes
    effect(() => {
      const position = this.geolocationService.currentPosition();
      if (position && this.map) {
        this.updateUserMarker(position);
      }
    });

    // React to geolocation errors
    effect(() => {
      const error = this.geolocationService.error();
      if (error) {
        console.error('Geolocation error:', error);
        // You could emit an event here to show an error message to the user
      }
    });
  }

  //Map instances and controls
  private map!: maplibregl.Map;
  private userMarker!: maplibregl.Marker;

  //Reference to the map container in the template
  mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  //Services
  private readonly api = inject(Api);
  private readonly mapFilterService = inject(MapFilterService);
  private readonly translate = inject(TranslateService);
  private readonly geolocationService = inject(GeolocationService);

  //Store current markers to remove them when filter changes
  private currentMarkers: maplibregl.Marker[] = [];

  //Orientation handler
  private orientationHandler?: (e: DeviceOrientationEvent) => void;

  ngAfterViewInit(): void {
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

    // Navigation control (only rotation)
    this.map.addControl(new maplibregl.NavigationControl({ showZoom: false }), 'top-right');

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
        this.updateAllLabelTranslations();
      });
    });

    //Emit event when map is clicked
    this.map.on('click', () => {
      this.mapClicked.emit();
    });

    //Listen to zoom changes to update label visibility
    this.map.on('zoom', () => {
      this.updateAllLabelVisibility();
    });
  }

  //Update user marker on map with position from geolocation service
  private updateUserMarker(position: UserGeolocationPosition): void {
    const lng = position.longitude;
    const lat = position.latitude;

    // Validate coordinates are valid (not 0,0 and within reasonable bounds)
    if (!lng || !lat || (lng === 0 && lat === 0)) {
      console.warn('Invalid coordinates received:', { lng, lat });
      return;
    }

    if (this.userMarker) {
      //Updates user position
      this.userMarker.setLngLat([lng, lat]);
    } else {
      // Create user marker with visual elements
      this.createUserMarker(lng, lat);
      this.requestOrientationPermission();
    }
  }

  //Create the user marker with blue pulsing circle and direction arrow
  private createUserMarker(lng: number, lat: number): void {
    const elContainer = document.createElement('div');
    elContainer.style.position = 'absolute';
    elContainer.style.width = '40px';
    elContainer.style.height = '40px';

    //Blue pulsing circle
    const circle = document.createElement('div');
    circle.style.position = 'absolute';
    circle.style.top = '50%';
    circle.style.left = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.width = '35px';
    circle.style.height = '35px';
    circle.style.background = '#007aff4d';
    circle.style.borderRadius = '50%';
    circle.style.zIndex = '0';
    circle.className = 'absolute w-10 h-10 bg-blue-500 rounded-full animate-pulse-circle';

    //Arrow indicating user orientation
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.top = '50%';
    arrow.style.left = '50%';
    arrow.style.transform = 'translate(-50%, -50%)';
    arrow.style.width = '20px';
    arrow.style.height = '20px';
    arrow.style.backgroundImage = 'url(assets/icons/mapPage/userLocation.svg)';
    arrow.style.backgroundSize = 'cover';
    arrow.style.backgroundRepeat = 'no-repeat';
    arrow.style.backgroundPosition = 'center';
    arrow.style.zIndex = '1';

    elContainer.appendChild(circle);
    elContainer.appendChild(arrow);

    //Add the marker to the map with center anchor to prevent position jumping
    this.userMarker = new maplibregl.Marker({ 
      element: elContainer,
      anchor: 'center' // Ensure marker is centered on coordinates
    })
      .setLngLat([lng, lat])
      .addTo(this.map);
  }

  // Public method to enable location tracking (called after user grants permission)
  public async enableLocationTracking(): Promise<void> {
    const success = await this.geolocationService.requestPermissionAndStartTracking();
    if (success) {
      console.log('Location tracking enabled');
    } else {
      console.error('Failed to enable location tracking');
    }
  }

  // Request permission for device orientation
  private requestOrientationPermission() {
    type DeviceOrientationWithPermission = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    const DeviceOrientation = DeviceOrientationEvent as DeviceOrientationWithPermission;
    const requestPermission = DeviceOrientation.requestPermission;

    if (typeof requestPermission === 'function') {
      requestPermission()
        .then(response => {
          if (response === 'granted') this.enableDeviceOrientation();
        })
        .catch(console.error);
    } else {
      this.enableDeviceOrientation();
    }
  }

  //Enable the device targeting event
  private enableDeviceOrientation() {
    // Remove old handler if exists
    if (this.orientationHandler) {
      globalThis.removeEventListener('deviceorientation', this.orientationHandler);
    }

    // Create and store new handler
    this.orientationHandler = (e: DeviceOrientationEvent) => {
      if (!this.userMarker) return;
      const heading = e.alpha ?? 0;
      const el = this.userMarker.getElement();
      const arrow = el.querySelector('div:last-child') as HTMLDivElement;
      if (arrow) {
        arrow.style.transform = `translate(-50%, -50%) rotate(${heading}deg)`;
      }
    };

    globalThis.addEventListener('deviceorientation', this.orientationHandler);
  }

  //Load places from API and display centroids on map
  private loadPlaces(filterKey: string | null = null): void {
    // Clear existing markers
    this.clearMarkers();

    // Choose API call based on filter
    const apiCall = filterKey ? this.api.getPlacesByType(filterKey) : this.api.getAllPlaces();

    apiCall.subscribe({
      next: (data: FeatureCollection) => {
        if (data?.features && Array.isArray(data.features)) {
          this.addCentroidsToMap(data.features);
        } else {
          console.warn('No features found in received data');
        }
      },
      error: error => {
        console.error('Error loading places:', error);
      }
    });
  }

  //Clear all markers from the map
  private clearMarkers(): void {
    for (const marker of this.currentMarkers) {
      marker.remove();
    }
    this.currentMarkers = [];
  }

  //Update visibility of all marker labels based on zoom level
  private updateAllLabelVisibility(): void {
    for (const marker of this.currentMarkers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((marker as any).updateLabelVisibility) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker as any).updateLabelVisibility();
      }
    }
  }

  //Update translations of all marker labels when language changes
  private updateAllLabelTranslations(): void {
    for (const marker of this.currentMarkers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const labelElement = (marker as any).labelElement;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buildingName = (marker as any).buildingName;
      if (labelElement && buildingName) {
        labelElement.textContent = this.getTranslatedBuildingName(buildingName);
      }
    }
  }

  //Get icon path from backend or use fallback
  private getIconForPlace(properties: PlaceFeature['properties']): string {
    // Use the icon from the backend if available
    if (properties.icon) {
      const iconPath = properties.icon;

      // If it's already a full URL (starts with http), use it as is
      if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
        return iconPath;
      }

      // Backend sends paths like "public/icon/parking.svg"
      // Fix the path by replacing "icon" with "icons"
      const cleanPath = iconPath.startsWith('/') ? iconPath.substring(1) : iconPath;
      const correctedPath = cleanPath.replace('/icon/', '/icons/');
      return `https://campusmap-file-storage.s3.us-east-1.amazonaws.com/${correctedPath}`;
    }

    // Fallback to default icon if not provided
    return 'assets/icons/building.svg';
  }

  //Get translated building name or return original if no translation exists
  private getTranslatedBuildingName(name: string): string {
    const translationKey = `Buildings.${name}`;
    const translated = this.translate.instant(translationKey);
    return translated === translationKey ? name : translated;
  }

  //Get the color for a place based on its properties
  private getColorForPlace(properties: PlaceFeature['properties']): string {
    const colorMap: Record<string, string> = {
      blue: '#0088c6',
      orange: '#f68b33',
      yellow: '#f5d226',
      green: '#8ebf3f'
    };

    // If color is defined in properties, use it
    if (properties.color) {
      return colorMap[properties.color];
    }

    // Default to blue (for parking and other types without color)
    return colorMap['blue'];
  }

  //Add centroid markers to the map
  private addCentroidsToMap(features: PlaceFeature[]): void {
    for (const [index, feature] of features.entries()) {
      const properties = feature.properties;
      const centroid = properties?.centroid;

      if (centroid?.coordinates && Array.isArray(centroid.coordinates)) {
        const [lng, lat] = centroid.coordinates as number[];

        // Get the icon from backend or use default
        const iconPath = this.getIconForPlace(properties);

        // Get the color hex value
        const colorHex = this.getColorForPlace(properties);

        // Create a custom marker element
        const markerContainer = document.createElement('div');
        markerContainer.style.display = 'flex';
        markerContainer.style.flexDirection = 'column';
        markerContainer.style.alignItems = 'center';
        markerContainer.style.cursor = 'pointer';

        const markerEl = document.createElement('div');
        markerEl.style.width = '24px';
        markerEl.style.height = '24px';

        // If we have a color, load the SVG and modify it
        if (colorHex && iconPath.includes('.svg')) {
          fetch(iconPath)
            .then(response => response.text())
            .then(svgText => {
              // Replace the fill color of the circle (st1 class)
              const modifiedSvg = svgText.replace(
                /(class="st1"[^>]*>)/,
                `$1<style>.st1{fill:${colorHex}!important;}</style>`
              );
              // Create a data URL from the modified SVG
              const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(blob);
              markerEl.style.backgroundImage = `url(${url})`;
              markerEl.style.backgroundSize = 'contain';
              markerEl.style.backgroundRepeat = 'no-repeat';
              markerEl.style.backgroundPosition = 'center';
            })
            .catch(() => {
              // Fallback to original icon if fetch fails
              markerEl.style.backgroundImage = `url(${iconPath})`;
              markerEl.style.backgroundSize = 'contain';
              markerEl.style.backgroundRepeat = 'no-repeat';
              markerEl.style.backgroundPosition = 'center';
            });
        } else {
          // Use the original icon without color modification
          markerEl.style.backgroundImage = `url(${iconPath})`;
          markerEl.style.backgroundSize = 'contain';
          markerEl.style.backgroundRepeat = 'no-repeat';
          markerEl.style.backgroundPosition = 'center';
        }

        // Create label element for the building name
        const labelEl = document.createElement('div');
        labelEl.textContent = this.getTranslatedBuildingName(properties.name);
        labelEl.style.fontSize = '16px';
        labelEl.style.fontWeight = '400';
        labelEl.style.letterSpacing = '1px';
        labelEl.style.color = colorHex || '#0088c6';
        labelEl.style.textShadow =
          '-1px -1px 1px #ffffffff, 1px 1px 1px #ffffffff, -1px 1px 1px #ffffffff, 1px -1px 1px #ffffffff';
        labelEl.style.textAlign = 'center';
        labelEl.style.marginTop = '4px';
        labelEl.style.whiteSpace = 'nowrap';
        labelEl.style.pointerEvents = 'none';
        labelEl.style.display = 'none'; // Initially hidden

        // Add icon and label to container
        markerContainer.appendChild(markerEl);
        markerContainer.appendChild(labelEl);

        // Function to update label visibility based on zoom level
        const updateLabelVisibility = () => {
          const zoom = this.map.getZoom();
          labelEl.style.display = zoom >= 18 ? 'block' : 'none';
        };

        // Set initial visibility
        updateLabelVisibility();

        // Add click event to marker container
        markerContainer.addEventListener('click', e => {
          e.stopPropagation(); // Prevent map click event
          const rawType = (properties.typeCode || properties.type || '')
            .toString()
            .toLowerCase()
            .trim();
          if (rawType === 'building' || rawType === 'parking') {
            this.placeSelected.emit({
              name: properties.name,
              type: rawType,
              imageUrl: properties.imageUrl || ''
            });
          } else {
            console.debug(
              'Marker click sin popup. typeCode:',
              properties.typeCode,
              'type:',
              properties.type
            );
          }
        });

        // Add marker to map and store reference
        const marker = new maplibregl.Marker({ element: markerContainer })
          .setLngLat([lng, lat])
          .addTo(this.map);

        this.currentMarkers.push(marker);

        // Store update function to call on zoom changes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker as any).updateLabelVisibility = updateLabelVisibility;
        // Store label element and building name for language updates
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker as any).labelElement = labelEl;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker as any).buildingName = properties.name;
      } else {
        console.warn(`Feature ${index + 1} does not have valid centroid coordinates`);
      }
    }
  }

  //Navigate to specific coordinates
  public flyToLocation(lng: number, lat: number, zoom = 19): void {
    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom: zoom,
        duration: 1500, // Animation duration in milliseconds
        essential: true // This animation is essential for the user
      });
    }
  }

  ngOnDestroy(): void {
    //Stop location tracking
    this.geolocationService.stopTracking();

    //Remove orientation event listener
    if (this.orientationHandler) {
      globalThis.removeEventListener('deviceorientation', this.orientationHandler);
    }

    //Deletes the map when the component is destroyed
    if (this.map) {
      this.map.remove();
    }
  }
}
