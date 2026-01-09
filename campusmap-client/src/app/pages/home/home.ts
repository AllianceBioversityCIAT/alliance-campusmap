import {
  Component,
  inject,
  ChangeDetectionStrategy,
  computed,
  signal,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HomeMessage } from './components/home-message/home-message';
import { HomeButtonLanguage } from './components/home-button-language/home-button-language';
import { HomeButtonReady } from './components/home-button-ready/home-button-ready';
import { LanguageService } from '@shared/services/language.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TranslateModule, HomeMessage, HomeButtonLanguage, HomeButtonReady],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  currentLang = signal(this.languageService.getCurrentLanguage());

  languageClass = computed(() => (this.currentLang() === 'es' ? 'lang-spanish' : 'lang-english'));

  backgroundSvg = computed(() => {
    const currentLang = this.currentLang();
    return currentLang === 'es'
      ? "bg-[url('/assets/images/background_homepage.svg')]"
      : "bg-[url('/assets/images/background_homepage_blue.svg')]";
  });

  constructor() {
    // Listen to language changes
    this.languageService.currentLanguage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => this.currentLang.set(lang));
  }
}
