import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: jest.fn()
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
