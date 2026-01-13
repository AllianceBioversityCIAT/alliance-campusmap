import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureCollection } from '@shared/types/place.model';
import { RouteFeatureCollection } from '@shared/types/route.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly apiUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  //Gets all buildings in GeoJSON format
  getBuildings(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(`${this.apiUrl}/api/v1/places`);
  }

  //Gets all places in GeoJSON format
  getAllPlaces(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(`${this.apiUrl}/api/v1/places`);
  }

  //Gets sites filtered by type example: 'building', 'parking'
  getPlacesByType(typeCode: string): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(`${this.apiUrl}/api/v1/places/type/${typeCode}`);
  }

  // This searches places by text using the backend endpoint
  searchPlaces(query: string): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(
      `${this.apiUrl}/api/v1/places?search=${encodeURIComponent(query)}`
    );
  }
  //Gets sites filtered by type example: 'building', 'parking'
  getSitesByType(typeCode: string): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(`${this.apiUrl}/api/v1/sites/type/${typeCode}`);
  }

  //Gets a route from current position to a place
  // lon: longitude, lat: latitude, placeId: destination id, mode: 1 walking, 2 driving
  getRouteToPlace(
    lon: number,
    lat: number,
    placeId: number,
    mode: 1 | 2
  ): Observable<RouteFeatureCollection> {
    return this.http.get<RouteFeatureCollection>(`${this.apiUrl}/api/v1/routing/place`, {
      params: {
        lon: String(lon),
        lat: String(lat),
        placeId: String(placeId),
        mode: String(mode)
      }
    });
  }

  //Gets a route from current position to the nearest assembly point (for emergency SOS)
  // lon: longitude, lat: latitude
  getRouteToNearestAssemblyPoint(lon: number, lat: number): Observable<RouteFeatureCollection> {
    return this.http.get<RouteFeatureCollection>(
      `${this.apiUrl}/api/v1/routing/nearest-assembly-point`,
      {
        params: {
          lon: String(lon),
          lat: String(lat)
        }
      }
    );
  }
}
