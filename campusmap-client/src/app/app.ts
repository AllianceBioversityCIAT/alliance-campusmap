import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type SupportedLang = 'en' | 'es';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, TranslateModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly translate = inject(TranslateService);

  constructor() {
    const storedLang = localStorage.getItem('lang') as SupportedLang | null;
    const browserLang = this.translate.getBrowserLang() as SupportedLang | undefined;
    const lang: SupportedLang = storedLang ?? browserLang ?? 'en';

    this.translate.setFallbackLang('en');
    this.translate.use(lang);
  }
}
