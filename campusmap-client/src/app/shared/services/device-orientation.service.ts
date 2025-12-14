import { Injectable } from '@angular/core';

type OrientationCallback = (heading: number) => void;

@Injectable({ providedIn: 'root' })
export class DeviceOrientationService {
  private orientationHandler?: (e: DeviceOrientationEvent) => void;
  private callback?: OrientationCallback;

  async requestPermission(): Promise<boolean> {
    type DeviceOrientationWithPermission = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    const DeviceOrientation = DeviceOrientationEvent as DeviceOrientationWithPermission;
    const requestPermission = DeviceOrientation.requestPermission;

    if (typeof requestPermission === 'function') {
      try {
        const response = await requestPermission();
        return response === 'granted';
      } catch {
        return false;
      }
    }

    return true; // Permission not needed on this device
  }

  startTracking(callback: OrientationCallback): void {
    this.stopTracking();

    this.callback = callback;
    this.orientationHandler = (e: DeviceOrientationEvent) => {
      const heading = e.alpha ?? 0;
      this.callback?.(heading);
    };

    globalThis.addEventListener('deviceorientation', this.orientationHandler);
  }

  stopTracking(): void {
    if (this.orientationHandler) {
      globalThis.removeEventListener('deviceorientation', this.orientationHandler);
      this.orientationHandler = undefined;
      this.callback = undefined;
    }
  }
}
