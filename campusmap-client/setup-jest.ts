import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

Object.defineProperty(globalThis.URL, 'createObjectURL', {
  writable: true,
  value: jest.fn()
});

// Polyfill fetch for tests (jsdom in Jest does not provide it by default)
const fetchMock = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('<svg></svg>')
  })
);
(globalThis as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;

// Basic geolocation mock to avoid navigator.geolocation absence in tests
const geolocationMock = {
  getCurrentPosition: jest.fn(success =>
    success?.({
      coords: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    } as GeolocationPosition)
  ),
  watchPosition: jest.fn(() => 1),
  clearWatch: jest.fn()
};
Object.defineProperty(globalThis.navigator, 'geolocation', {
  configurable: true,
  value: geolocationMock
});

jest.mock('maplibre-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    addControl: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    remove: jest.fn(),
    getLayer: jest.fn(),
    getSource: jest.fn(),
    getZoom: jest.fn().mockReturnValue(17)
  })),
  NavigationControl: jest.fn(),
  GeolocateControl: jest.fn(),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setPopup: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    getElement: jest.fn(() => document.createElement('div'))
  })),
  Popup: jest.fn(() => ({
    setText: jest.fn().mockReturnThis()
  }))
}));
