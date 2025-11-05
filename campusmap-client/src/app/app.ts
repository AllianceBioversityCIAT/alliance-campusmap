import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

type SupportedLang = 'en' | 'es';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, TranslateModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  private readonly translate = inject(TranslateService);

  constructor() {
    const storedLang = localStorage.getItem('lang') as SupportedLang | null;
    const browserLang = this.translate.getBrowserLang() as SupportedLang | undefined;
    const lang: SupportedLang = storedLang ?? browserLang ?? 'en';

    this.translate.setDefaultLang('en');
    this.translate.use(lang);
  }
}
