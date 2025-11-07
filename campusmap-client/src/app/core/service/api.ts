import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl =
    'https://api.maptiler.com/data/019a17ce-d24d-7595-91de-c9e012d10b2d/features.json?key=ysbhdSG63XiCe6Sgq0TG';

  private http = inject(HttpClient);

  getBuildings(): Observable<unknown> {
    return this.http.get<unknown>(this.apiUrl);
  }
}
