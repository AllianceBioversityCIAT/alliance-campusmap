import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HomeMessage } from './components/home-message/home-message';
import { HomeButtonLanguage } from './components/home-button-language/home-button-language';
import { HomeButtonReady } from './components/home-button-ready/home-button-ready';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, HomeMessage, HomeButtonLanguage, HomeButtonReady],
  templateUrl: './home.html'
})
export class Home {
  private readonly translate = inject(TranslateService);
  language: 'en' | 'es';

  constructor() {
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
