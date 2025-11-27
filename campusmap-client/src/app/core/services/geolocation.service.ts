import { Injectable, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export interface UserGeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export type GeolocationStatus =
  | 'idle'
  | 'requesting-permission'
  | 'permission-granted'
  | 'permission-denied'
  | 'tracking'
  | 'error';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  // Signals for reactive state management
  private readonly _status = signal<GeolocationStatus>('idle');
  private readonly _currentPosition = signal<UserGeolocationPosition | null>(null);
  private readonly _error = signal<GeolocationError | null>(null);
  private readonly _isHighAccuracy = signal<boolean>(true);

  // Public read-only signals
  readonly status = this._status.asReadonly();
  readonly currentPosition = this._currentPosition.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isHighAccuracy = this._isHighAccuracy.asReadonly();

  // Computed signals
  readonly isTracking = computed(() => this._status() === 'tracking');
  readonly hasPermission = computed(
    () =>
      this._status() === 'permission-granted' ||
      this._status() === 'tracking'
  );
  readonly hasError = computed(() => this._status() === 'error');

  // Private state
  private watchId: number | null = null;
  private readonly positionSubject = new Subject<UserGeolocationPosition>();
  private readonly errorSubject = new Subject<GeolocationError>();

  // Observable streams
  readonly position$ = this.positionSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  // High accuracy options for campus navigation
  private readonly HIGH_ACCURACY_OPTIONS: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0 // Always get fresh position
  };

  // Standard accuracy options (fallback)
  private readonly STANDARD_ACCURACY_OPTIONS: PositionOptions = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 5000
  };

  /**
   * Check if geolocation is supported by the browser
   */
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Check current permission state (if Permissions API is supported)
   */
  async checkPermission(): Promise<PermissionState | 'unsupported'> {
    if (!('permissions' in navigator)) {
      return 'unsupported';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      console.warn('Could not query geolocation permission:', error);
      return 'unsupported';
    }
  }

  /**
   * Request permission and start tracking user location
   */
  async requestPermissionAndStartTracking(): Promise<boolean> {
    if (!this.isSupported()) {
      const error = {
        code: 0,
        message: 'Geolocation is not supported by this browser'
      };
      this._error.set(error);
      this._status.set('error');
      this.errorSubject.next(error);
      return false;
    }

    this._status.set('requesting-permission');
    this._error.set(null);

    try {
      // First, try to get current position to trigger permission request
      await this.getCurrentPosition();
      this._status.set('permission-granted');

      // Then start watching position
      this.startTracking();
      return true;
    } catch (error) {
      this.handleGeolocationError(error as GeolocationPositionError);
      return false;
    }
  }

  /**
   * Get current position once
   */
  getCurrentPosition(): Promise<UserGeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options = this._isHighAccuracy()
        ? this.HIGH_ACCURACY_OPTIONS
        : this.STANDARD_ACCURACY_OPTIONS;

      navigator.geolocation.getCurrentPosition(
        position => {
          const geoPosition = this.transformPosition(position);
          this._currentPosition.set(geoPosition);
          this.positionSubject.next(geoPosition);
          resolve(geoPosition);
        },
        error => {
          this.handleGeolocationError(error);
          reject(new Error(error.message));
        },
        options
      );
    });
  }

  /**
   * Start continuous location tracking
   */
  startTracking(): void {
    if (!this.isSupported()) {
      console.error('Geolocation not supported');
      return;
    }

    // Clear any existing watch
    this.stopTracking();

    const options = this._isHighAccuracy()
      ? this.HIGH_ACCURACY_OPTIONS
      : this.STANDARD_ACCURACY_OPTIONS;

    this.watchId = navigator.geolocation.watchPosition(
      position => {
        const geoPosition = this.transformPosition(position);
        this._currentPosition.set(geoPosition);
        this._status.set('tracking');
        this._error.set(null);
        this.positionSubject.next(geoPosition);
      },
      error => {
        this.handleGeolocationError(error);
      },
      options
    );

    console.log('Geolocation tracking started with watch ID:', this.watchId);
  }

  /**
   * Stop location tracking
   */
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      console.log('Geolocation tracking stopped');
      this.watchId = null;
    }

    if (this._status() === 'tracking') {
      this._status.set('permission-granted');
    }
  }

  /**
   * Toggle between high and standard accuracy
   */
  toggleAccuracy(): void {
    const newAccuracy = !this._isHighAccuracy();
    this._isHighAccuracy.set(newAccuracy);

    // Restart tracking with new accuracy if currently tracking
    if (this.isTracking()) {
      this.startTracking();
    }

    console.log(`Geolocation accuracy set to: ${newAccuracy ? 'HIGH' : 'STANDARD'}`);
  }

  /**
   * Set accuracy mode
   */
  setHighAccuracy(enabled: boolean): void {
    if (this._isHighAccuracy() === enabled) return;

    this._isHighAccuracy.set(enabled);

    // Restart tracking with new accuracy if currently tracking
    if (this.isTracking()) {
      this.startTracking();
    }
  }

  /**
   * Reset the service state
   */
  reset(): void {
    this.stopTracking();
    this._status.set('idle');
    this._currentPosition.set(null);
    this._error.set(null);
  }

  /**
   * Transform native GeolocationPosition to our interface
   */
  private transformPosition(position: GeolocationPosition): UserGeolocationPosition {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };
  }

  /**
   * Handle geolocation errors
   */
  private handleGeolocationError(error: GeolocationPositionError | Error): void {
    let geoError: GeolocationError;

    if ('code' in error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          geoError = {
            code: error.PERMISSION_DENIED,
            message: 'User denied the request for Geolocation'
          };
          this._status.set('permission-denied');
          break;
        case error.POSITION_UNAVAILABLE:
          geoError = {
            code: error.POSITION_UNAVAILABLE,
            message: 'Location information is unavailable'
          };
          this._status.set('error');
          break;
        case error.TIMEOUT:
          geoError = {
            code: error.TIMEOUT,
            message: 'The request to get user location timed out'
          };
          this._status.set('error');
          break;
        default:
          geoError = {
            code: 0,
            message: 'An unknown error occurred'
          };
          this._status.set('error');
      }
    } else {
      geoError = {
        code: 0,
        message: error.message || 'An unknown error occurred'
      };
      this._status.set('error');
    }

    this._error.set(geoError);
    this.errorSubject.next(geoError);
    console.error('Geolocation error:', geoError);
  }

  /**
   * Calculate distance between two points in meters (Haversine formula)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Check if position is within campus bounds
   */
  isWithinCampusBounds(
    latitude: number,
    longitude: number,
    campusBounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  ): boolean {
    // Default bounds for Alliance campus (you can adjust these)
    campusBounds ??= {
      north: 3.508,
      south: 3.5,
      east: -76.353,
      west: -76.36
    };

    return (
      latitude <= campusBounds.north &&
      latitude >= campusBounds.south &&
      longitude <= campusBounds.east &&
      longitude >= campusBounds.west
    );
  }
}
