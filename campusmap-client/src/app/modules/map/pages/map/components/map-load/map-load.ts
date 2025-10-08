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
      container: 'map', // id del contenedor
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=ysbhdSG63XiCe6Sgq0TG', // estilo del mapa ysbhdSG63XiCe6Sgq0TG
      center: [-76.35689183576403, 3.5053660738551082], // [longitud, latitud]
      zoom: 18,
      minZoom: 15,
      maxZoom: 20,
      bearing: 165, // rotación
      pitch: 60 // inclinación
    });

    //Control de navegación (zoom + rotacion)
    this.map.addControl(new maplibregl.NavigationControl({}), 'top-right');
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
