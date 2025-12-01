import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, signal, ChangeDetectionStrategy, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MapFilterService } from '../../../../../../core/services/map-filter.service';

type FilterKey = 'building' | 'parking' | 'bathroom' | 'cafeteria' | 'assembly-point' | 'warehouse';

const FILTER_DEFS: readonly {
  key: FilterKey;
  src: string;
  i18nKey: string;
}[] = [
  { key: 'building', i18nKey: 'Map.filters.buildings', src: 'assets/icons/mapPage/building.svg' },
  { key: 'parking', i18nKey: 'Map.filters.parking', src: 'assets/icons/mapPage/parking.svg' },
  { key: 'bathroom', i18nKey: 'Map.filters.bathrooms', src: 'assets/icons/mapPage/bath.svg' },
  {
    key: 'cafeteria',
    i18nKey: 'Map.filters.cafeterias',
    src: 'assets/icons/mapPage/cafeteria.svg'
  },
  {
    key: 'assembly-point',
    i18nKey: 'Map.filters.assemblyPoint',
    src: 'assets/icons/mapPage/assembly_point.svg'
  },
  { key: 'warehouse', i18nKey: 'Map.filters.warehouse', src: 'assets/icons/mapPage/warehouse.svg' }
];

@Component({
  selector: 'app-filter-controls',
  imports: [CommonModule, TranslateModule, NgOptimizedImage],
  templateUrl: './filter-controls.html',
  styleUrls: ['./filter-controls.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterControls {
  // Output para notificar al padre cuando se abre el filtro
  readonly openFilter = output<void>();
  private readonly mapFilterService = inject(MapFilterService);

  //Checks if the filter panel is visible
  open = signal(false);

  //Currently active filter
  activeFilter = signal<FilterKey | null>(null);

  // Changes the status of the panel when the user presses the main button
  toggle() {
    const wasOpen = this.open();
    this.open.update(value => !value);
    if (!wasOpen) {
      // Si se va a abrir el filtro, notifica al padre
      this.openFilter.emit();
    }
  }

  // Permite cerrar el filtro desde el padre
  close() {
    this.open.set(false);
  }

  // Handle filter selection
  onFilterClick(filterKey: FilterKey): void {
    if (this.activeFilter() === filterKey) {
      // If clicking the same filter, deactivate it
      this.activeFilter.set(null);
      this.mapFilterService.clearFilter();
    } else {
      // Activate the new filter
      this.activeFilter.set(filterKey);
      this.mapFilterService.setFilter(filterKey);
    }
  }

  // Check if a filter is active
  isFilterActive(filterKey: FilterKey): boolean {
    return this.activeFilter() === filterKey;
  }

  // Static list of available filters (translated in template)
  readonly filters = FILTER_DEFS;
}
