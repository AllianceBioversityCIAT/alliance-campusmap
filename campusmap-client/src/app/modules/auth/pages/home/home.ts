import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TranslateModule],
  templateUrl: './home.html',
})
export class Home {
  language: 'en' | 'es' = 'en';

  constructor(private translate: TranslateService) {
    const savedLang = (localStorage.getItem('lang') as 'en' | 'es') || 'en';
    this.language = savedLang;
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }

  setLanguage(lang: 'en' | 'es') {
    this.language = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
