import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBar {
  query = '';
  results: string[] = [];
}
