import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MapFilterService } from '../../../../../../core/services/map-filter.service';

@Component({
  selector: 'app-filter-controls',
  imports: [CommonModule, TranslateModule],
  templateUrl: './filter-controls.html',
  styleUrls: ['./filter-controls.scss']
})
export class FilterControls {
  private readonly translate = inject(TranslateService);
  private readonly mapFilterService = inject(MapFilterService);

  //Checks if the filter panel is visible
  open = false;

  //Currently active filter
  activeFilter: string | null = null;

  // Changes the status of the panel when the user presses the main button
  toggle() {
    this.open = !this.open;
  }

  // Handle filter selection
  onFilterClick(filterKey: string): void {
    if (this.activeFilter === filterKey) {
      // If clicking the same filter, deactivate it
      this.activeFilter = null;
      this.mapFilterService.clearFilter();
    } else {
      // Activate the new filter
      this.activeFilter = filterKey;
      this.mapFilterService.setFilter(filterKey);
    }
  }

  // Check if a filter is active
  isFilterActive(filterKey: string): boolean {
    return this.activeFilter === filterKey;
  }

  // List of available filters. Each filter contains its key, tag,
  // icon path and the name displayed on the screen.
  get filters() {
    return [
      {
        key: 'building',
        label: this.translate.instant('Map.filters.buildings') as string,
        src: 'assets/icons/mapPage/building.svg',
        name: this.translate.instant('Map.filters.buildings') as string
      },
      {
        key: 'parking',
        label: this.translate.instant('Map.filters.parking') as string,
        src: 'assets/icons/mapPage/parking.svg',
        name: this.translate.instant('Map.filters.parking') as string
      },
      {
        key: 'bathroom',
        label: this.translate.instant('Map.filters.bathrooms') as string,
        src: 'assets/icons/mapPage/bath.svg',
        name: this.translate.instant('Map.filters.bathrooms') as string
      },
      {
        key: 'cafeteria',
        label: this.translate.instant('Map.filters.cafeterias') as string,
        src: 'assets/icons/mapPage/cafeteria.svg',
        name: this.translate.instant('Map.filters.cafeterias') as string
      },
      {
        key: 'assembly-point',
        label: this.translate.instant('Map.filters.assemblyPoint') as string,
        src: 'assets/icons/mapPage/assembly_point.svg',
        name: this.translate.instant('Map.filters.assemblyPoint') as string
      },
      {
        key: 'warehouse',
        label: this.translate.instant('Map.filters.warehouse') as string,
        src: 'assets/icons/mapPage/warehouse.svg',
        name: this.translate.instant('Map.filters.warehouse') as string
      }
    ];
  }
}
