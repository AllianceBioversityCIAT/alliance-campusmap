import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HomeMessage } from "./components/home-message/home-message";
import { HomeButtonLanguage } from "./components/home-button-language/home-button-language";
import { HomeButtonReady } from "./components/home-button-ready/home-button-ready";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TranslateModule, HomeMessage, HomeButtonLanguage, HomeButtonReady],
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
