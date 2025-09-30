import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('campusmap');
  private translate = inject(TranslateService);
  language = (localStorage.getItem('lang') as 'en' | 'es') ?? 'en';

  constructor() {
    // fallbackLang fue configurado en app.config.ts; aquí ponemos el idioma en uso
    this.translate.use(this.language);
  }

  setLanguage(lang: 'en' | 'es') {
    this.language = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
