import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-controls.html',
  styleUrls: ['./filter-controls.scss']
})
export class FilterControls {
  //Checks if the filter panel is visible
  open = false;

  // Changes the status of the panel when the user presses the main button
  toggle() {
    this.open = !this.open;
  }

  // List of available filters. Each filter contains its key, tag,
  // icon path and the name displayed on the screen.
  filters = [
    {
      key: 'iconic',
      label: 'Edificios',
      src: 'assets/icons/mapPage/building.svg',
      name: 'Edificios'
    },
    {
      key: 'parking',
      label: 'Parqueaderos',
      src: 'assets/icons/mapPage/parking.svg',
      name: 'Parqueaderos'
    },
    { key: 'bathroom', label: 'Baños', src: 'assets/icons/mapPage/bath.svg', name: 'Baños' },
    {
      key: 'cafeteria',
      label: 'Cafeterías',
      src: 'assets/icons/mapPage/cafeteria.svg',
      name: 'Cafeterias'
    },
    {
      key: 'assembly-point',
      label: 'Assembly Point',
      src: 'assets/icons/mapPage/assembly_point.svg',
      name: 'Assembly Point'
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      src: 'assets/icons/mapPage/warehouse.svg',
      name: 'Warehouse'
    }
  ];
}
