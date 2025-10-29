import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1/places';

  getAllPlaces(): Observable<unknown> {
    return this.http.get(this.baseUrl);
  }

  getPlacesByType(type: string): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/type/${type}`);
  }
}
