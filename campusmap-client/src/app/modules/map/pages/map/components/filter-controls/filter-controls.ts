import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-controls',
  imports: [CommonModule, TranslateModule],
  templateUrl: './filter-controls.html',
  styleUrls: ['./filter-controls.scss']
})
export class FilterControls {
  private readonly translate = inject(TranslateService);

  //Checks if the filter panel is visible
  open = false;

  // Changes the status of the panel when the user presses the main button
  toggle() {
    this.open = !this.open;
  }

  // List of available filters. Each filter contains its key, tag,
  // icon path and the name displayed on the screen.
  get filters() {
    return [
      {
        key: 'iconic',
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
