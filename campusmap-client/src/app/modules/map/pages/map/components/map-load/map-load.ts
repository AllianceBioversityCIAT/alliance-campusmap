import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-map-load',
  imports: [],
  templateUrl: './map-load.html',
  styleUrl: './map-load.scss'
})
export class MapLoad implements AfterViewInit, OnDestroy {
  private map!: maplibregl.Map;

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
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
