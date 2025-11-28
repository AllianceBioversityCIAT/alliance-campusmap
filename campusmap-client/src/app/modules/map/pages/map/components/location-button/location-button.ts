import { Component, inject, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeolocationService } from '../../../../../../core/services/geolocation.service';

@Component({
  selector: 'app-location-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="onCenterLocation()"
      [attr.aria-label]="'Center on my location'"
      [attr.title]="'Center on my location'"
      class="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.1)] hover:bg-gray-100 flex items-center justify-center relative">
      <!-- Location Icon -->
      <svg
        class="w-6 h-6 md:w-8 md:h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        [style.transform]="'rotate(' + orientation() + 'deg)'">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    </button>
  `,
  styleUrls: ['./location-button.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationButton {
  readonly geolocationService = inject(GeolocationService);
  readonly centerOnLocation = output<void>();

  // Signal for device orientation (alpha)
  private readonly orientationSignal = signal<number>(0);
  orientation = this.orientationSignal.asReadonly();

  constructor() {
    if ('DeviceOrientationEvent' in globalThis) {
      globalThis.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
        if (typeof event.alpha === 'number') {
          this.orientationSignal.set(event.alpha);
        }
      });
    }
  }

  onCenterLocation(): void {
    this.centerOnLocation.emit();
  }
}
