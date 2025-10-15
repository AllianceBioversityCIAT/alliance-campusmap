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
  open = false;
  toggle() {
    this.open = !this.open;
  }

  filters = [
    { key: 'iconic', label: 'Edificios', src: 'assets/icons/iconic.svg', name: 'Edificios' },
    {
      key: 'parking',
      label: 'Parqueaderos',
      src: 'assets/icons/parking.svg',
      name: 'Parqueaderos'
    },
    { key: 'bathroom', label: 'Baños', src: 'assets/icons/bath.svg', name: 'Baños' },
    {
      key: 'cafeteria',
      label: 'Cafeterías',
      src: 'assets/icons/cafeteria.svg',
      name: 'Cafeterias'
    },
    {
      key: 'assembly-point',
      label: 'Assembly Point',
      src: 'assets/icons/assembly_point.svg',
      name: 'Assembly Point'
    }
  ];
}
