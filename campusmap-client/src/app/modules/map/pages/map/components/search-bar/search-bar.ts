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
    // Load all places from the API
    this.apiService.getAllPlaces().subscribe({
      next: data => {
        this.allPlaces.set(data.features);
      },
      error: error => {
        console.error('Error loading places:', error);
      }
    });

    // Load history from localStorage
    this.loadHistory();
  }

  toggleList() {
    this.isOpen.update(value => !value);
  }

  onInputChange(newValue: string) {
    this.searchQuery.set(newValue);
    // If less than 3 characters, show history
    if (newValue.length < 3) {
      this.filteredPlaces.set([]);
      return;
    }

    // Filter places by name (from 3 characters onwards)
    const query = newValue.toLowerCase();
    this.filteredPlaces.set(
      this.allPlaces().filter(place => place.properties.name.toLowerCase().includes(query))
    );
  }

  onFocus() {
    this.isOpen.set(true);
    // If no active search, show only history
    if (this.searchQuery().length < 3) {
      this.filteredPlaces.set([]);
    }
  }

  onBlur() {
    // Delay to allow clicking on an element
    setTimeout(() => {
      this.isOpen.set(false);
    }, 200);
  }

  selectPlace(place: PlaceFeature) {
    this.searchQuery.set(place.properties.name);
    this.isOpen.set(false);

    // Save to history
    this.addToHistory(place);

    // Emit event with selected place
    this.locationSelected.emit(place);
  }

  private loadHistory() {
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
    // Check if the place is already in history
    const existingIndex = currentHistory.findIndex(item => item.id === place.id);

    let newHistory = [...currentHistory];
    // If it exists, move it to the beginning
    if (existingIndex > -1) {
      newHistory.splice(existingIndex, 1);
    }

    // Add to the beginning
    newHistory.unshift(place);

    // Keep only the last MAX_HISTORY_ITEMS
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    this.searchHistory.set(newHistory);

    // Save to localStorage
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  get displayedItems(): PlaceFeature[] {
    // If active search (3+ characters), show filtered results
    if (this.searchQuery().length >= 3) {
      return this.filteredPlaces();
    }
    // Otherwise, show history
    return this.searchHistory();
  }
}
