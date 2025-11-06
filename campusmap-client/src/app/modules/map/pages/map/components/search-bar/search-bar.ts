import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss']
})
export class SearchBar {
  isOpen = false;

  toggleList() {
    this.isOpen = !this.isOpen;
  }
}
