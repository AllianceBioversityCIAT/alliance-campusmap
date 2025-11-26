import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapFilterService {
  private readonly filterSubject = new BehaviorSubject<string | null>(null);
  
  // Observable to subscribe to filter changes
  filter$: Observable<string | null> = this.filterSubject.asObservable();
  
  // Set the current filter
  setFilter(filterKey: string | null): void {
    this.filterSubject.next(filterKey);
  }
  
  // Get the current filter value
  getCurrentFilter(): string | null {
    return this.filterSubject.value;
  }
  
  // Clear the filter
  clearFilter(): void {
    this.filterSubject.next(null);
  }
}
