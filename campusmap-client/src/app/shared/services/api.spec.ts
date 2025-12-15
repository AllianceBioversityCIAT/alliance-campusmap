import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Api } from './api';

describe('Api', () => {
  let service: Api;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(Api);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call routing endpoint with expected query params', () => {
    const lon = -76.3031;
    const lat = 3.5294;
    const placeId = 123;
    const mode = 1 as const;

    service.getRouteToPlace(lon, lat, placeId, mode).subscribe();

    const expectedUrl =
      'https://1hz14f3vx1.execute-api.us-east-1.amazonaws.com/api/v1/routing/place';
    const req = httpMock.expectOne(r => r.url === expectedUrl);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('lon')).toBe(String(lon));
    expect(req.request.params.get('lat')).toBe(String(lat));
    expect(req.request.params.get('placeId')).toBe(String(placeId));
    expect(req.request.params.get('mode')).toBe(String(mode));

    req.flush({ type: 'FeatureCollection', features: [] });
    httpMock.verify();
  });
});
