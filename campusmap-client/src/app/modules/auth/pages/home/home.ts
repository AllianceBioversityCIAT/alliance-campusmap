import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HomeMessage } from './components/home-message/home-message';
import { HomeButtonReady } from './components/home-button-ready/home-button-ready';
import { HomeButtonLanguage } from './components/home-button-language/home-button-language';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TranslateModule],
  templateUrl: './home.html'
})
export class Home {
  language: 'en' | 'es' = 'en';

  constructor(private readonly translate: TranslateService) {
    const savedLang = (localStorage.getItem('lang') as 'en' | 'es') || 'en';
    this.language = savedLang;
    this.translate.addLangs(['en', 'es']);
    this.translate.use(savedLang);
  }

  setLanguage(lang: 'en' | 'es') {
    this.language = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
