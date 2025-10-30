import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaceFeatureCollection } from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1/places';

  getAllPlaces(): Observable<unknown> {
    return this.http.get(this.baseUrl);
  }

  getPlacesByType(type: string): Observable<PlaceFeatureCollection> {
    return this.http.get<PlaceFeatureCollection>(`${this.baseUrl}/type/${type}`);
  }
}
