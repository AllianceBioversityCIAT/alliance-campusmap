import { Component, inject, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GeolocationService } from '@shared/services/geolocation.service';

@Component({
  selector: 'app-location-button',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <button
      type="button"
      (click)="onCenterLocation()"
      [attr.aria-label]="'Center on my location'"
      [attr.title]="'Center on my location'"
      class="w-8 h-8 md:w-12 md:h-12 rounded-full">
      <!-- Location Icon -->
      <img
        ngSrc="assets/icons/gps.svg"
        alt="Center on my location"
        [title]="'Center on my location'"
        width="64"
        height="64"
        priority />
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
