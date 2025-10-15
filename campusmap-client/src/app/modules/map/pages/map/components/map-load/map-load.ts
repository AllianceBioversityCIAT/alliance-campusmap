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

  //MARKERS
  private markersData = {
    iconic: [{ coords: [-76.35568053354409, 3.502904404370369], name: 'Edificio Principal' }],
    bathrooms: [
      { coords: [-76.3567, 3.5052], name: 'Baño Prueba' },
      { coords: [-76.3572, 3.5056], name: 'Baño Prueba 2' }
    ],
    parking: [
      { coords: [-76.355, 3.5032], name: 'Parking 1' },
      { coords: [-76.3551, 3.5028], name: 'Parking 2' },
      { coords: [-76.3565, 3.5027], name: 'Parking 3' },
      { coords: [-76.35725, 3.5023], name: 'Parking 4' },
      { coords: [-76.3546, 3.5039], name: 'Parking 5' },
      { coords: [-76.3541, 3.5025], name: 'Parking 6' },
      { coords: [-76.3543, 3.502], name: 'Parking 7' },
      { coords: [-76.3549, 3.5022], name: 'Parking 8' },
      { coords: [-76.3565, 3.5016], name: 'Parking 9' },
      { coords: [-76.357, 3.5011], name: 'Parking 10' },
      { coords: [-76.3544, 3.5008], name: 'Parking 11' },
      { coords: [-76.3555, 3.5011], name: 'Parking 12' },
      { coords: [-76.3554, 3.5007], name: 'Parking 13' },
      { coords: [-76.3552, 3.5002], name: 'Parking 14' },
      { coords: [-76.3569, 3.4996], name: 'Parking 15' },
      { coords: [-76.3548, 3.4993], name: 'Parking 16' },
      { coords: [-76.3561, 3.4989], name: 'Parking 17' }
    ],
    assembly_point: [
      { coords: [-76.35696437822699, 3.50531705059618], name: 'Assembly Point 1' },
      { coords: [-76.35611732103561, 3.502973974770825], name: 'Assembly Point 2A' },
      { coords: [-76.35522101629275, 3.5033672186704283], name: 'Assembly Point 2B' },
      { coords: [-76.35449927172499, 3.501800796142725], name: 'Assembly Point 3' },
      { coords: [-76.3558918684754, 3.500302536237089], name: 'Assembly Point 4' },
      { coords: [-76.35871822851637, 3.500899406263856], name: 'Assembly Point 5' }
    ]
  };

  private createMarkerIcon(category: string): HTMLElement {
    const el = document.createElement('div');
    el.className = 'custom-marker';

    switch (category) {
      case 'iconic':
        el.style.backgroundImage = 'url(assets/icons/iconic.svg)';
        break;
      case 'bathrooms':
        el.style.backgroundImage = 'url(assets/icons/bath.svg)';
        break;
      case 'parking':
        el.style.backgroundImage = 'url(assets/icons/parking.svg)';
        break;
      case 'assembly_point':
        el.style.backgroundImage = 'url(assets/icons/assembly_point.svg)';
        break;
    }

    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.cursor = 'pointer';
    el.style.filter = 'drop-shadow(1px 2px 3px rgba(0,0,0,0.3))';
    el.style.borderRadius = '8px';

    return el;
  }

  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      container: 'map', // id container
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=ysbhdSG63XiCe6Sgq0TG', // map style
      center: [-76.35689183576403, 3.5053660738551082], // [longitude, latitude]
      zoom: 18,
      minZoom: 15,
      maxZoom: 20,
      bearing: 165, // rotation
      pitch: 60 // inclination
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

    //Markers
    Object.entries(this.markersData).forEach(([category, markers]) => {
      markers.forEach(({ coords, name }) => {
        const icon = this.createMarkerIcon(category);

        new maplibregl.Marker({ element: icon })
          .setLngLat(coords as [number, number])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setText(name))
          .addTo(this.map);
      });
    });

    // GEOJSON
    // Escuchar cambios en el input del archivo
    const fileInput = document.getElementById('geojson-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.addEventListener('change', event => this.handleFileSelect(event));
    }
  }

  // Metodo independiente
  private handleFileSelect = (evt: Event): void => {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const geoJSONcontent = JSON.parse(e.target?.result as string);

        // Si ya existe una capa anterior, elimínala
        if (this.map.getLayer('uploaded-polygons')) {
          this.map.removeLayer('uploaded-polygons');
        }
        if (this.map.getSource('uploaded-source')) {
          this.map.removeSource('uploaded-source');
        }

        // Añadir el nuevo GeoJSON
        this.map.addSource('uploaded-source', {
          type: 'geojson',
          data: geoJSONcontent
        });

        this.map.addLayer({
          id: 'uploaded-polygons',
          type: 'fill',
          source: 'uploaded-source',
          paint: {
            'fill-color': '#888888',
            'fill-outline-color': '#ff0000',
            'fill-opacity': 0.4
          },
          filter: ['==', '$type', 'Polygon']
        });

        console.log('GeoJSON cargado correctamente');
      } catch (err) {
        console.error('Error al cargar el GeoJSON:', err);
      }
    };

    reader.readAsText(file, 'UTF-8');
  };

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
