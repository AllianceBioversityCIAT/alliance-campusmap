import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HomeMessage } from './components/home-message/home-message';
import { HomeButtonReady } from './components/home-button-ready/home-button-ready';
import { HomeButtonLanguage } from './components/home-button-language/home-button-language';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, HomeMessage, HomeButtonReady, HomeButtonLanguage],
  templateUrl: './home.html'
})
export class Home {}
