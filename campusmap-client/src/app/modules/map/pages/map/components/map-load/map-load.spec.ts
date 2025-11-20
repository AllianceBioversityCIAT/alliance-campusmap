import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MapLoad } from './map-load';
import { Api } from '../../../../../../core/service/api';

describe('MapLoad', () => {
  let component: MapLoad;
  let fixture: ComponentFixture<MapLoad>;
  let mockWatchPosition: jest.Mock;
  let mockClearWatch: jest.Mock;

  beforeEach(async () => {
    // Create mock functions
    mockWatchPosition = jest.fn().mockReturnValue(1); // Return a watch ID
    mockClearWatch = jest.fn();
    
    // Mock navigator.geolocation
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: {
        watchPosition: mockWatchPosition,
        clearWatch: mockClearWatch
      },
      configurable: true,
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MapLoad],
      providers: [Api]
    }).compileComponents();

    fixture = TestBed.createComponent(MapLoad);
    component = fixture.componentInstance;
    
    // Note: We don't call fixture.detectChanges() here to avoid initializing the map
    // which would fail in test environment without actual maplibre-gl setup
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use enhanced geolocation options for accuracy', () => {
    // Manually call trackUser to test geolocation setup
    (component as any).trackUser();
    
    // Verify watchPosition was called with correct options
    expect(mockWatchPosition).toHaveBeenCalled();
    
    const callArgs = mockWatchPosition.mock.calls[0];
    const options = callArgs[2] as PositionOptions;
    
    // Verify enhanced options for better accuracy
    expect(options.enableHighAccuracy).toBe(true);
    expect(options.timeout).toBe(10000);
    expect(options.maximumAge).toBe(0);
  });

  it('should filter out low accuracy positions', () => {
    // Manually call trackUser to set up geolocation
    (component as any).trackUser();
    
    const successCallback = mockWatchPosition.mock.calls[0][0];
    
    // Simulate a low accuracy position (100m)
    const lowAccuracyPosition: GeolocationPosition = {
      coords: {
        latitude: 3.50442,
        longitude: -76.35655,
        accuracy: 100, // Low accuracy - above threshold
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    };

    // Spy on console.warn
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    successCallback(lowAccuracyPosition);
    
    // Should log warning about low accuracy
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Position accuracy too low'));
    
    warnSpy.mockRestore();
  });

  it('should accept high accuracy positions', () => {
    // Manually call trackUser to set up geolocation
    (component as any).trackUser();
    
    const successCallback = mockWatchPosition.mock.calls[0][0];
    
    // Simulate a high accuracy position (20m)
    const highAccuracyPosition: GeolocationPosition = {
      coords: {
        latitude: 3.50442,
        longitude: -76.35655,
        accuracy: 20, // High accuracy - below threshold
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    };

    // Spy on console.log
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    
    successCallback(highAccuracyPosition);
    
    // Should log the position update
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Position updated'));
    
    logSpy.mockRestore();
  });

  it('should handle geolocation errors with proper messages', () => {
    // Manually call trackUser to set up geolocation
    (component as any).trackUser();
    
    const errorCallback = mockWatchPosition.mock.calls[0][1];
    
    // Spy on console.error
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Test PERMISSION_DENIED error
    const permissionError: GeolocationPositionError = {
      code: 1, // PERMISSION_DENIED
      message: 'User denied geolocation',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    };
    
    errorCallback(permissionError);
    
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('User denied geolocation permission'));
    
    errorSpy.mockRestore();
  });

  it('should clean up geolocation watch on destroy', () => {
    // Manually call trackUser to set up geolocation
    (component as any).trackUser();
    
    // Verify a watch was started
    expect(mockWatchPosition).toHaveBeenCalled();
    
    // Call ngOnDestroy
    component.ngOnDestroy();
    
    // Verify clearWatch was called
    expect(mockClearWatch).toHaveBeenCalledWith(1);
  });
});
