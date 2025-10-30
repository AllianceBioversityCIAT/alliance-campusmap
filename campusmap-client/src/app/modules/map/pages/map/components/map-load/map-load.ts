import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Api } from '../../../../../../core/service/api';
import { PlaceFeatureCollection, PlaceFeature } from '../../../../../../core/models/place.model';

@Component({
  selector: 'app-map-load',
  imports: [],
  templateUrl: './map-load.html',
  styleUrl: './map-load.scss'
})
export class MapLoad implements AfterViewInit, OnDestroy {
  private map!: maplibregl.Map;
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

    // Add geolocate control to the map.
    this.map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }),
      'bottom-right'
    );

    this.map.on('load', () => this.loadCentroids());
  }

  // Load centroids of the buildings API
  private loadCentroids() {
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
  }

  // add Buildings
  private addBuildings(res: PlaceFeatureCollection) {
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
  }

  // Add Parkings
  private addParkings(res: PlaceFeatureCollection) {
    // Eliminar capa previa si existe
    if (this.map.getSource('parkings')) {
      this.map.removeLayer('parkings-layer');
      this.map.removeSource('parkings');
    }

    // Assign dynamic icon based on "Parking N" or SF/BL exceptions
    res.features.forEach((f: PlaceFeature) => {
      const name = f.properties.name.toUpperCase(); // "PARQUEADERO SF"
      const matchNum = /\d+/.exec(name); // search number

      if (name.includes('SF')) f.properties.icon = 'parking_SF-icon';
      else if (name.includes('BL')) f.properties.icon = 'parking_BL-icon';
      else if (matchNum) f.properties.icon = `parking_${matchNum[0]}-icon`;
      else f.properties.icon = 'parking_0-icon'; // fallback
    });

    // Load icons of the parking
    const iconNames = [
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
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
