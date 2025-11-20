import { AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, inject, Output, EventEmitter } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Api } from '../../../../../../core/service/api';
import { PlaceFeature, FeatureCollection } from '../../../../../../core/models/place.model';
import { MapFilterService } from '../../../../../../core/services/map-filter.service';

@Component({
  selector: 'app-map-load',
  standalone: true,
  imports: [],
  templateUrl: './map-load.html',
  styleUrls: ['./map-load.scss']
})
export class MapLoad implements AfterViewInit, OnDestroy {
  //Output event when a place is selected
  @Output() placeSelected = new EventEmitter<{ name: string; type: string; imageUrl: string }>();
  //Output event when the map is clicked
  @Output() mapClicked = new EventEmitter<void>();

  //Map instances and controls
  private map!: maplibregl.Map;
  private readonly geolocate!: maplibregl.GeolocateControl;
  private userMarker!: maplibregl.Marker;
  private accuracyCircle!: HTMLDivElement;
  private watchId: number | null = null;
  private readonly ACCURACY_THRESHOLD = 50; // meters - only update if accuracy is better than this
  private lastHeading = 0;
  private readonly HEADING_SMOOTHING_FACTOR = 0.3; // Lower = smoother but slower response

  //Reference to the map container in the template
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  //Service for future requests to the backend
  private readonly api = inject(Api);
  private readonly mapFilterService = inject(MapFilterService);

  //Store current markers to remove them when filter changes
  private currentMarkers: maplibregl.Marker[] = [];

  //Initialize the map using the referenced element
  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      // Use the element reference instead of the global id to avoid "Container 'map' not found" errors
      container: this.mapContainer?.nativeElement ?? 'map',
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
      this.trackUser();
      this.loadPlaces();
      
      // Subscribe to filter changes
      this.mapFilterService.filter$.subscribe(filterKey => {
        this.loadPlaces(filterKey);
      });
    });

    //Emit event when map is clicked
    this.map.on('click', () => {
      this.mapClicked.emit();
    });
  }

  //Turn on user location tracking
  private trackUser() {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      return;
    }

    // Enhanced geolocation options for maximum accuracy
    const options: PositionOptions = {
      enableHighAccuracy: true,  // Use GPS if available
      timeout: 10000,             // 10 seconds timeout
      maximumAge: 0               // Always get fresh position, no cached data
    };

    this.watchId = navigator.geolocation.watchPosition(
      pos => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        const accuracy = pos.coords.accuracy; // Accuracy in meters

        // Filter out low-accuracy positions
        if (accuracy > this.ACCURACY_THRESHOLD) {
          console.warn(`Position accuracy too low: ${accuracy}m (threshold: ${this.ACCURACY_THRESHOLD}m)`);
          // Still update if we don't have a marker yet (first position)
          if (this.userMarker) {
            return;
          }
        }

        //If the marker does not exist, create it with the visual elements
        if (this.userMarker) {
          //Updates user position
          this.userMarker.setLngLat([lng, lat]);
          
          // Update accuracy circle size based on actual accuracy
          this.updateAccuracyCircle(accuracy);
        } else {
          // Create user marker
          const elContainer = document.createElement('div');
          elContainer.style.position = 'absolute';
          elContainer.style.width = '40px';
          elContainer.style.height = '40px';

          //Accuracy circle - will be dynamically sized
          this.accuracyCircle = document.createElement('div');
          this.accuracyCircle.style.position = 'absolute';
          this.accuracyCircle.style.top = '50%';
          this.accuracyCircle.style.left = '50%';
          this.accuracyCircle.style.transform = 'translate(-50%, -50%)';
          this.accuracyCircle.style.background = '#007aff4d';
          this.accuracyCircle.style.borderRadius = '50%';
          this.accuracyCircle.style.zIndex = '0';
          this.accuracyCircle.className = 'absolute bg-blue-500 rounded-full animate-pulse-circle';
          
          // Set initial size based on accuracy
          this.updateAccuracyCircle(accuracy);

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
          arrow.style.zIndex = '1';

          elContainer.appendChild(this.accuracyCircle);
          elContainer.appendChild(arrow);

          //Add the marker to the map
          this.userMarker = new maplibregl.Marker({ element: elContainer })
            .setLngLat([lng, lat])
            .addTo(this.map);

          this.requestOrientationPermission();
        }

        // Log accuracy for debugging
        console.log(`Position updated - Accuracy: ${accuracy.toFixed(1)}m, Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      },
      err => {
        // Enhanced error handling
        let errorMessage = 'Error getting location: ';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'User denied geolocation permission';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out';
            break;
          default:
            errorMessage += err.message;
        }
        console.error(errorMessage);
      },
      options
    );
  }

  // Update the accuracy circle size based on GPS accuracy
  private updateAccuracyCircle(accuracyMeters: number): void {
    if (!this.accuracyCircle || !this.map) return;

    // Convert accuracy from meters to pixels at current zoom level
    // At zoom 17 (default), roughly 1 meter = 0.3 pixels
    // This is an approximation and varies by latitude
    const metersPerPixel = 156543.03392 * Math.cos(this.map.getCenter().lat * Math.PI / 180) / Math.pow(2, this.map.getZoom());
    const accuracyPixels = accuracyMeters / metersPerPixel;
    
    // Clamp size between 35px (minimum) and 100px (maximum) for visual consistency
    const size = Math.max(35, Math.min(100, accuracyPixels));
    
    this.accuracyCircle.style.width = `${size}px`;
    this.accuracyCircle.style.height = `${size}px`;
  }

  // Request permission for device orientation
  private requestOrientationPermission() {
    // Check if DeviceOrientationEvent is available
    if (typeof DeviceOrientationEvent === 'undefined') {
      return;
    }

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
    globalThis.addEventListener('deviceorientation', e => {
      if (!this.userMarker) return;
      
      // Get raw heading
      const rawHeading = e.alpha ?? 0;
      
      // Apply exponential smoothing to reduce jitter
      // This makes the compass more stable while still being responsive
      const headingDiff = rawHeading - this.lastHeading;
      
      // Handle wrap-around at 0/360 degrees
      let adjustedDiff = headingDiff;
      if (headingDiff > 180) {
        adjustedDiff = headingDiff - 360;
      } else if (headingDiff < -180) {
        adjustedDiff = headingDiff + 360;
      }
      
      // Apply smoothing
      const smoothedHeading = this.lastHeading + (adjustedDiff * this.HEADING_SMOOTHING_FACTOR);
      this.lastHeading = smoothedHeading;
      
      // Update marker rotation
      const el = this.userMarker.getElement();
      el.style.transform = `rotate(${smoothedHeading}deg)`;
    });
  }

  //Load places from API and display centroids on map
  private loadPlaces(filterKey: string | null = null): void {
    // Clear existing markers
    this.clearMarkers();

    // Choose API call based on filter
    const apiCall = filterKey 
      ? this.api.getPlacesByType(filterKey)
      : this.api.getAllPlaces();

    apiCall.subscribe({
      next: (data: FeatureCollection) => {
        
        if (data?.features && Array.isArray(data.features)) {
          this.addCentroidsToMap(data.features);
        } else {
          console.warn('No hay features en los datos recibidos');
        }
      },
      error: (error) => {
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

  //Get icon path based on place type
  private getIconForType(typeCode: string, placeName: string): string {
    // Special handling for parking lots with specific names
    if (typeCode === 'parking') {
      // Extract parking number/identifier from name if present
      const parkingRegex = /Parqueadero\s+(\w+)/i;
      const parkingMatch = parkingRegex.exec(placeName);
      if (parkingMatch) {
        const parkingId = parkingMatch[1];
        // Check if specific parking icon exists
        const specificIcon = `assets/icons/mapPage/parking_${parkingId}.svg`;
        return specificIcon;
      }
      return 'assets/icons/mapPage/parking.svg';
    }

    // Map type codes to icon paths
    const iconMap: Record<string, string> = {
      'building': 'assets/icons/mapPage/building.svg',
      'bathroom': 'assets/icons/mapPage/bath.svg',
      'cafeteria': 'assets/icons/mapPage/cafeteria.svg',
      'assembly_point': 'assets/icons/mapPage/assembly_point.svg',
      'warehouse': 'assets/icons/mapPage/warehouse.svg'
    };

    return iconMap[typeCode] || 'assets/icons/mapPage/building.svg';
  }

  //Add centroid markers to the map
  private addCentroidsToMap(features: PlaceFeature[]): void {
    
    for (const [index, feature] of features.entries()) {
      const properties = feature.properties;
      const centroid = properties?.centroid;

      if (centroid?.coordinates && Array.isArray(centroid.coordinates)) {
        const [lng, lat] = centroid.coordinates as number[];

        // Get the appropriate icon for this place type
        const iconPath = this.getIconForType(properties.typeCode || 'building', properties.name);

        // Create a custom marker element with just the icon
        const markerEl = document.createElement('div');
        markerEl.style.width = '24px';
        markerEl.style.height = '24px';
        markerEl.style.backgroundImage = `url(${iconPath})`;
        markerEl.style.backgroundSize = 'contain';
        markerEl.style.backgroundRepeat = 'no-repeat';
        markerEl.style.backgroundPosition = 'center';
        markerEl.style.cursor = 'pointer';

        // Add click event to marker
        markerEl.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent map click event
          this.placeSelected.emit({
            name: properties.name,
            type: properties.typeCode || 'building',
            imageUrl: properties.imageUrl || ''
          });
        });

        // Add marker to map and store reference
        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat([lng, lat])
          .addTo(this.map);
        
        this.currentMarkers.push(marker);
      } else {
        console.warn(`Feature ${index + 1} no tiene coordenadas válidas de centroid`);
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
    // Stop watching position to prevent memory leaks
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    
    //Deletes the map when the component is destroyed
    if (this.map) {
      this.map.remove();
    }
  }
}
