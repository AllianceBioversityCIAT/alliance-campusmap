import { AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Api } from '../../../../../../core/service/api';

@Component({
  selector: 'app-map-load',
  standalone: true,
  imports: [],
  templateUrl: './map-load.html',
  styleUrls: ['./map-load.scss']
})
export class MapLoad implements AfterViewInit, OnDestroy {
  private map!: maplibregl.Map;
  private geolocate!: maplibregl.GeolocateControl;
  private userMarker!: maplibregl.Marker;

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private readonly api = inject(Api);

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

    // Navigation control (zoom and rotation)
    this.map.addControl(new maplibregl.NavigationControl({ showZoom: false }), 'top-right');

    this.map.on('load', () => {
      this.trackUser();
    });
  }

  // Track user location
  // Geolocation used only to display user's position locally.
  // Data is not stored or sent to any external service.
  private trackUser() {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition(
      pos => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;

        if (!this.userMarker) {
          // Create user marker
          const elContainer = document.createElement('div');
          elContainer.style.position = 'absolute';
          elContainer.style.width = '40px';
          elContainer.style.height = '40px';

          // Accuracy circle
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

          this.userMarker = new maplibregl.Marker({ element: elContainer })
            .setLngLat([lng, lat])
            .addTo(this.map);

          this.requestOrientationPermission();
        } else {
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

  private enableDeviceOrientation() {
    window.addEventListener('deviceorientation', e => {
      if (!this.userMarker) return;
      const heading = e.alpha ?? 0;
      const el = this.userMarker.getElement();
      el.style.transform = `rotate(${heading}deg)`;
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
