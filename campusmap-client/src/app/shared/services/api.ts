import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureCollection } from '@shared/types/place.model';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly apiUrl = 'https://1hz14f3vx1.execute-api.us-east-1.amazonaws.com';

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
}
