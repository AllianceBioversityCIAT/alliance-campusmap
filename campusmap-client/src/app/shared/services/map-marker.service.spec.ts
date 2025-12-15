import { TestBed } from '@angular/core/testing';
import { MapMarkerService } from './map-marker.service';
import { TranslateService } from '@ngx-translate/core';
import type { PlaceFeature } from '@shared/types/place.model';

class TranslateServiceMock {
  instant(key: string): string {
    return key;
  }
}

describe('MapMarkerService', () => {
  let service: MapMarkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapMarkerService, { provide: TranslateService, useClass: TranslateServiceMock }]
    });
    service = TestBed.inject(MapMarkerService);
  });

  describe('getColor (via private access)', () => {
    const getColor = (props: PlaceFeature['properties']) =>
      (service as unknown as { getColor: (props: PlaceFeature['properties']) => string }).getColor(
        props
      );

    it('uses named colors mapped to hex', () => {
      const hex = getColor({
        id: 1,
        name: 'Edificio Test',
        color: 'blue',
        centroid: { type: 'Point', coordinates: [0, 0] }
      } as PlaceFeature['properties']);
      expect(hex).toBe('#219ed4');
    });

    it('uses hex color directly (lowercased)', () => {
      const hex = getColor({
        id: 2,
        name: 'Edificio Hex',
        color: '#FF0000',
        centroid: { type: 'Point', coordinates: [0, 0] }
      } as PlaceFeature['properties']);
      expect(hex).toBe('#ff0000');
    });

    it('defaults cafeterias to yellow when color missing', () => {
      const hex = getColor({
        id: 3,
        name: 'Cafetería',
        typeCode: 'cafetienda',
        centroid: { type: 'Point', coordinates: [0, 0] }
      } as PlaceFeature['properties']);
      expect(hex).toBe('#f6c644');
    });

    it('defaults to blue when no color and not cafeteria', () => {
      const hex = getColor({
        id: 4,
        name: 'Otro',
        centroid: { type: 'Point', coordinates: [0, 0] }
      } as PlaceFeature['properties']);
      expect(hex).toBe('#219ed4');
    });
  });

  describe('createMarkerIcon behavior (recolor flag)', () => {
    it('does not recolor when recolorSvg=false (e.g., parking)', () => {
      const svc = service as unknown as {
        createMarkerIcon: (path: string, color: string, recolor: boolean) => void;
        applyColorToSvg: (path: string, color: string) => void;
        applyBackgroundImage: (path: string) => void;
      };
      const applyColorSpy = jest.spyOn(svc, 'applyColorToSvg');
      const applyBgSpy = jest.spyOn(svc, 'applyBackgroundImage');

      svc.createMarkerIcon('/assets/icons/mapPage/building.svg', '#219ed4', false);

      expect(applyColorSpy).not.toHaveBeenCalled();
      expect(applyBgSpy).toHaveBeenCalledTimes(1);
    });

    it('recolors when recolorSvg=true and is SVG', () => {
      const svc = service as unknown as {
        createMarkerIcon: (path: string, color: string, recolor: boolean) => void;
        applyColorToSvg: (path: string, color: string) => void;
      };
      const applyColorSpy = jest.spyOn(svc, 'applyColorToSvg');

      svc.createMarkerIcon('/assets/icons/mapPage/building.svg', '#219ed4', true);

      expect(applyColorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
