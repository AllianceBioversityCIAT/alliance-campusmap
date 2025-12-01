import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Api } from '../../../../../../core/services/api';
import { PlaceFeature } from '../../../../../../core/models/place.model';

const HISTORY_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 5;

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar implements OnInit {
  locationSelected = output<PlaceFeature>();

  private readonly apiService = inject(Api);

  isOpen = signal(false);
  searchQuery = signal('');
  allPlaces = signal<PlaceFeature[]>([]);
  filteredPlaces = signal<PlaceFeature[]>([]);
  searchHistory = signal<PlaceFeature[]>([]);

  ngOnInit() {
    // Here we get all places from the API when the component loads
    this.apiService.getAllPlaces().subscribe({
      next: data => {
        this.allPlaces.set(data.features);
      },
      error: error => {
        console.error('Error loading places:', error);
      }
    });

    // We also load the search history from localStorage
    this.loadHistory();
  }

  toggleList() {
    // This just toggles the dropdown list open or closed
    this.isOpen.update(value => !value);
  }

  private searchTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  onInputChange(newValue: string) {
    this.searchQuery.set(newValue);
    // If the query is less than 3 characters, just show the history and don't search
    if (newValue.length < 2) {
      this.filteredPlaces.set([]);
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      return;
    }

    // Debounce: wait 300ms before searching so we don't spam the backend
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.apiService.searchPlaces(newValue).subscribe({
        next: data => {
          this.filteredPlaces.set(data.features);
        },
        error: error => {
          console.error('Error searching places:', error);
          this.filteredPlaces.set([]);
        }
      });
    }, 300);
  }

  onFocus() {
    this.isOpen.set(true);
    // If there is no active search, just show the history
    if (this.searchQuery().length < 2) {
      this.filteredPlaces.set([]);
    }
  }

  onBlur() {
    // We delay closing so the user can click on a result
    setTimeout(() => {
      this.isOpen.set(false);
    }, 200);
  }

  selectPlace(place: PlaceFeature) {
    this.searchQuery.set(place.properties.name);
    this.isOpen.set(false);

    // Add the selected place to the history
    this.addToHistory(place);

    // Emit the event with the selected place
    this.locationSelected.emit(place);
  }

  private loadHistory() {
    // This loads the search history from localStorage
    try {
      const historyJson = localStorage.getItem(HISTORY_KEY);
      if (historyJson) {
        this.searchHistory.set(JSON.parse(historyJson));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      this.searchHistory.set([]);
    }
  }

  private addToHistory(place: PlaceFeature) {
    const currentHistory = this.searchHistory();
    // See if the place is already in the history
    const existingIndex = currentHistory.findIndex(item => item.id === place.id);

    let newHistory = [...currentHistory];
    // If it is, move it to the front
    if (existingIndex > -1) {
      newHistory.splice(existingIndex, 1);
    }

    // Add the new place to the front
    newHistory.unshift(place);

    // Only keep the last MAX_HISTORY_ITEMS
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    this.searchHistory.set(newHistory);

    // Save the updated history to localStorage
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  get displayedItems(): PlaceFeature[] {
    // If there is an active search (3+ characters), show the filtered results
    if (this.searchQuery().length >= 3) {
      return this.filteredPlaces();
    }
    // Otherwise, just show the history
    return this.searchHistory();
  }
}
