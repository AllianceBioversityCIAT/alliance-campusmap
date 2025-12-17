import { Injectable } from '@angular/core';
import maplibregl from 'maplibre-gl';

@Injectable({ providedIn: 'root' })
export class UserMarkerService {
  private userMarker?: maplibregl.Marker;
  private arrowElement?: HTMLDivElement;

  createUserMarker(map: maplibregl.Map, lng: number, lat: number): maplibregl.Marker {
    const container = this.createMarkerContainer();
    const circle = this.createPulsingCircle();
    const arrow = this.createDirectionArrow();

    container.appendChild(circle);
    container.appendChild(arrow);

    this.userMarker = new maplibregl.Marker({
      element: container,
      anchor: 'center'
    })
      .setLngLat([lng, lat])
      .addTo(map);

    this.arrowElement = arrow;
    return this.userMarker;
  }

  updatePosition(lng: number, lat: number): void {
    if (!this.userMarker) return;

    // Validate coordinates
    if (!lng || !lat || (lng === 0 && lat === 0)) {
      console.warn('Invalid coordinates received:', { lng, lat });
      return;
    }

    this.userMarker.setLngLat([lng, lat]);
  }

  updateOrientation(heading: number): void {
    if (!this.arrowElement) return;

    const correctedHeading = 360 - heading;
    this.arrowElement.style.transform = `translate(-50%, -50%) rotate(${correctedHeading}deg)`;
  }

  exists(): boolean {
    return !!this.userMarker;
  }

  remove(): void {
    if (this.userMarker) {
      this.userMarker.remove();
      this.userMarker = undefined;
      this.arrowElement = undefined;
    }
  }

  private createMarkerContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '40px';
    container.style.height = '40px';
    container.style.zIndex = '3';
    return container;
  }

  private createPulsingCircle(): HTMLDivElement {
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
    return circle;
  }

  private createDirectionArrow(): HTMLDivElement {
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
    return arrow;
  }
}
