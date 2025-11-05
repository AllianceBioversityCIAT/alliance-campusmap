import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Api } from '../../../../../../core/service/api';

@Component({
  selector: 'app-map-load',
  imports: [],
  templateUrl: './map-load.html',
  styleUrls: ['./map-load.scss']
})
export class MapLoad implements AfterViewInit, OnDestroy {
  private map!: maplibregl.Map;
  private geolocate!: maplibregl.GeolocateControl;
  private userMarker!: maplibregl.Marker;

  private readonly api = inject(Api);

  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      container: 'map', // id container
      style:
        'https://api.maptiler.com/maps/019a0d96-0c62-770e-82b8-be41643f8563/style.json?key=ysbhdSG63XiCe6Sgq0TG', // map style
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
      /*this.loadCentroids();*/
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
          arrow.className = 'user-arrow';
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
          //this.map.flyTo({ center: [lng, lat], speed: 0.8 });
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

  // Load centroids of the buildings API
  /*private loadCentroids() {
    // Load buildings
    this.api.getPlacesByType('building').subscribe({
      next: (res: PlaceFeatureCollection) => {
        if (res?.features) this.addBuildings(res);
      },
      error: err => console.error('Error al obtener edificios:', err)
    });

    // Load parkings
    this.api.getPlacesByType('parking').subscribe({
      next: (res: PlaceFeatureCollection) => {
        if (res?.features) this.addParkings(res);
      },
      error: err => console.error('Error al obtener parqueaderos:', err)
    });
  }*/

  // add Buildings
  /*private addBuildings(res: PlaceFeatureCollection) {
    // Eliminar capa previa si existe
    if (this.map.getSource('buildings')) {
      this.map.removeLayer('buildings-layer');
      this.map.removeSource('buildings');
    }

    // Load unique icon for buildings
    this.map.loadImage('assets/icons/mapPage/building.png', (error, image) => {
      if (error || !image) {
        console.error('Error al cargar icono de edificio:', error);
        return;
      }

      if (!this.map.hasImage('building-icon')) {
        this.map.addImage('building-icon', image);
      }

      this.map.addSource('buildings', {
        type: 'geojson',
        data: res
      });

      this.map.addLayer({
        id: 'buildings-layer',
        type: 'symbol',
        source: 'buildings',
        layout: {
          'icon-image': 'building-icon',
          'icon-size': 1,
          'icon-allow-overlap': false
        },
        minzoom: 15,
        maxzoom: 20
      });
    });
  }*/

  // Add Parkings
  /*private addParkings(res: PlaceFeatureCollection) {
    // Eliminar capa previa si existe
    if (this.map.getSource('parkings')) {
      this.map.removeLayer('parkings-layer');
      this.map.removeSource('parkings');
    }*/

  // Assign dynamic icon based on "Parking N" or SF/BL exceptions
  /*res.features.forEach((f: PlaceFeature) => {
      const name = f.properties.name.toUpperCase(); // "PARQUEADERO SF"
      const matchNum = /\d+/.exec(name); // search number

      if (name.includes('SF')) f.properties.icon = 'parking_SF-icon';
      else if (name.includes('BL')) f.properties.icon = 'parking_BL-icon';
      else if (matchNum) f.properties.icon = `parking_${matchNum[0]}-icon`;
      else f.properties.icon = 'parking_0-icon'; // fallback
    });*/

  // Load icons of the parking
  /*const iconNames = [
      ...Array.from({ length: 17 }, (_, i) => `parking_${i + 1}-icon`),
      'parking_SF-icon',
      'parking_BL-icon'
    ];

    let loaded = 0;
    for (const id of iconNames) {
      const path = `assets/icons/parking/${id.replace('-icon', '')}.png`;

      this.map.loadImage(path, (error, image) => {
        loaded++;
        if (error || !image) {
          console.warn(`No se pudo cargar el icono ${path}`);
          return;
        }

        if (!this.map.hasImage(id)) {
          this.map.addImage(id, image);
        }

        if (loaded === iconNames.length) {
          this.map.addSource('parkings', {
            type: 'geojson',
            data: res
          });

          this.map.addLayer({
            id: 'parkings-layer',
            type: 'symbol',
            source: 'parkings',
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': 1,
              'icon-anchor': 'center',
              'icon-allow-overlap': false
            },
            minzoom: 15,
            maxzoom: 20
          });
        }
      });
    }
  }*/
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
