import { AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, inject, Output, EventEmitter } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Api } from '../../../../../../core/service/api';
import { PlaceFeature, FeatureCollection } from '../../../../../../core/models/place.model';

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
  private geolocate!: maplibregl.GeolocateControl;
  private userMarker!: maplibregl.Marker;

  //Reference to the map container in the template
  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  //Service for future requests to the backend
  private readonly api = inject(Api);

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
    });

    //Emit event when map is clicked
    this.map.on('click', () => {
      this.mapClicked.emit();
    });
  }

  //Turn on user location tracking
  private trackUser() {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition(
      pos => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;

        //If the marker does not exist, create it with the visual elements
        if (!this.userMarker) {
          // Create user marker
          const elContainer = document.createElement('div');
          elContainer.style.position = 'absolute';
          elContainer.style.width = '40px';
          elContainer.style.height = '40px';

          //Accuracy circle
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
          arrow.style.zIndex = '1';

          elContainer.appendChild(circle);
          elContainer.appendChild(arrow);

          //Add the marker to the map
          this.userMarker = new maplibregl.Marker({ element: elContainer })
            .setLngLat([lng, lat])
            .addTo(this.map);

          this.requestOrientationPermission();
        } else {
          //Updates user position
          this.userMarker.setLngLat([lng, lat]);
        }
      },
      err => console.error(err),
      { enableHighAccuracy: true }
    );

    // Orbit control to follow user
    window.addEventListener('deviceorientation', e => {
      if (!this.userMarker) return;
      const heading = e.alpha ?? 0;
      const el = this.userMarker.getElement();
      el.style.transform = `rotate(${heading}deg)`;
    });
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
    window.addEventListener('deviceorientation', e => {
      if (!this.userMarker) return;
      const heading = e.alpha ?? 0;
      const el = this.userMarker.getElement();
      el.style.transform = `rotate(${heading}deg)`;
    });
  }

  //Load places from API and display centroids on map
  private loadPlaces(): void {

    this.api.getAllPlaces().subscribe({
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

  //Add centroid markers to the map
  private addCentroidsToMap(features: PlaceFeature[]): void {
    
    features.forEach((feature: PlaceFeature, index: number) => {
      const properties = feature.properties;
      const centroid = properties?.centroid;

      if (centroid?.coordinates && Array.isArray(centroid.coordinates)) {
        const [lng, lat] = centroid.coordinates as number[];

        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.style.width = '30px';
        markerEl.style.height = '30px';
        markerEl.style.backgroundColor = 'red'; // Color de respaldo visible
        markerEl.style.borderRadius = '50%';
        markerEl.style.border = '3px solid white';
        markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        markerEl.style.backgroundImage = 'url(assets/icons/mapPage/bath.svg)';
        markerEl.style.backgroundSize = 'cover';
        markerEl.style.cursor = 'pointer';

        // Add click event to marker
        markerEl.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent map click event
          this.placeSelected.emit({
            name: properties.name,
            type: 'Building', // Puedes obtener esto de properties.typeId si lo tienes
            imageUrl: properties.imageUrl || ''
          });
        });

        // Add marker to map
        new maplibregl.Marker({ element: markerEl })
          .setLngLat([lng, lat])
          .addTo(this.map);
      } else {
        console.warn(`Feature ${index + 1} no tiene coordenadas válidas de centroid`);
      }
    });
  }

  ngOnDestroy(): void {
    //Deletes the map when the component is destroyed
    if (this.map) {
      this.map.remove();
    }
  }
}
