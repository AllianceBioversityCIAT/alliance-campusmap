import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, TranslateModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss']
})
export class SearchBar {
  isOpen = false;

  toggleList() {
    this.isOpen = !this.isOpen;
  }
}
