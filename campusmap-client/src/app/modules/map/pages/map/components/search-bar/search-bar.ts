import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Api } from '../../../../../../core/service/api';
import { PlaceFeature } from '../../../../../../core/models/place.model';

const HISTORY_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 5;

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss']
})
export class SearchBar implements OnInit {
  @Output() locationSelected = new EventEmitter<PlaceFeature>();
  
  private apiService = inject(Api);
  
  isOpen = false;
  searchQuery = '';
  allPlaces: PlaceFeature[] = [];
  filteredPlaces: PlaceFeature[] = [];
  searchHistory: PlaceFeature[] = [];

  ngOnInit() {
    console.log('SearchBar component initialized');
    // Cargar todos los lugares desde la API
    this.apiService.getAllPlaces().subscribe({
      next: (data) => {
        console.log('Places loaded:', data.features.length);
        this.allPlaces = data.features;
      },
      error: (error) => {
        console.error('Error loading places:', error);
      }
    });

    // Cargar historial desde localStorage
    this.loadHistory();
    console.log('History loaded:', this.searchHistory.length, 'items');
  }

  toggleList() {
    this.isOpen = !this.isOpen;
  }

  onInputChange() {
    // Si hay menos de 3 caracteres, mostrar historial
    if (this.searchQuery.length < 3) {
      this.filteredPlaces = [];
      return;
    }

    // Filtrar lugares por nombre (a partir de 3 caracteres)
    const query = this.searchQuery.toLowerCase();
    this.filteredPlaces = this.allPlaces.filter(place => 
      place.properties.name.toLowerCase().includes(query)
    );
  }

  onFocus() {
    this.isOpen = true;
    // Si no hay búsqueda activa, mostrar solo historial
    if (this.searchQuery.length < 3) {
      this.filteredPlaces = [];
    }
  }

  onBlur() {
    // Delay para permitir el click en un elemento
    setTimeout(() => {
      this.isOpen = false;
    }, 200);
  }

  selectPlace(place: PlaceFeature) {
    this.searchQuery = place.properties.name;
    this.isOpen = false;
    
    // Guardar en historial
    this.addToHistory(place);
    
    // Emitir evento con el lugar seleccionado
    this.locationSelected.emit(place);
    console.log('Selected place:', place);
  }

  private loadHistory() {
    try {
      const historyJson = localStorage.getItem(HISTORY_KEY);
      if (historyJson) {
        this.searchHistory = JSON.parse(historyJson);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      this.searchHistory = [];
    }
  }

  private addToHistory(place: PlaceFeature) {
    // Verificar si el lugar ya está en el historial
    const existingIndex = this.searchHistory.findIndex(
      item => item.id === place.id
    );

    // Si existe, moverlo al principio
    if (existingIndex > -1) {
      this.searchHistory.splice(existingIndex, 1);
    }

    // Agregar al principio
    this.searchHistory.unshift(place);

    // Mantener solo los últimos MAX_HISTORY_ITEMS
    if (this.searchHistory.length > MAX_HISTORY_ITEMS) {
      this.searchHistory = this.searchHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    // Guardar en localStorage
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  get displayedItems(): PlaceFeature[] {
    // Si hay búsqueda activa (3+ caracteres), mostrar resultados filtrados
    if (this.searchQuery.length >= 3) {
      return this.filteredPlaces;
    }
    // Si no, mostrar historial
    return this.searchHistory;
  }
}
