import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureCollection } from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly apiUrl = 'http://1hz14f3vx1.execute-api.us-east-1.amazonaws.com';
  
  private readonly http = inject(HttpClient);

  //Gets all buildings in GeoJSON format
  getBuildings(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(`${this.apiUrl}/api/v1/places`);
  }

  //Gets all places in GeoJSON format
  getAllPlaces(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(`${this.apiUrl}/api/v1/places`);
  }

  //Gets places filtered by type example: 'building', 'parking'
  getPlacesByType(typeCode: string): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(`${this.apiUrl}/api/v1/places/type/${typeCode}`);
  }
}
