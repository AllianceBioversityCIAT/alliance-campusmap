import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if geolocation is supported', () => {
    const isSupported = service.isSupported();
    expect(typeof isSupported).toBe('boolean');
  });

  it('should calculate distance between two points', () => {
    // Distance between two known points (approximately 1km apart)
    const distance = service.calculateDistance(
      3.50442, -76.35655, // Alliance campus
      3.51442, -76.35655  // 1km north
    );
    // Should be approximately 1111 meters (1 degree latitude ≈ 111km)
    expect(distance).toBeGreaterThan(1000);
    expect(distance).toBeLessThan(1200);
  });

  it('should check if position is within campus bounds', () => {
    // Point inside campus
    const insideCampus = service.isWithinCampusBounds(3.50442, -76.35655);
    expect(insideCampus).toBe(true);

    // Point outside campus
    const outsideCampus = service.isWithinCampusBounds(3.6, -76.4);
    expect(outsideCampus).toBe(false);
  });
});
