import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type SupportedLang = 'en' | 'es';

@Component({
  selector: 'app-home-button-language',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule, TranslateModule],
  templateUrl: './home-button-language.html',
  styleUrl: './home-button-language.scss'
})
export class HomeButtonLanguage {
  readonly stateOptions = [
    { label: 'English', value: 'en' satisfies SupportedLang },
    { label: 'Español', value: 'es' satisfies SupportedLang }
  ];

  value: SupportedLang;

  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const storedLang = (localStorage.getItem('lang') as SupportedLang | null) ?? undefined;
    const defaultLang =
      (this.translate.currentLang as SupportedLang | undefined) ??
      (this.translate.defaultLang as SupportedLang | undefined) ??
      'en';

    this.value = storedLang ?? defaultLang;

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      this.value = event.lang as SupportedLang;
    });
  }

  onLanguageChange(lang: SupportedLang) {
    if (!lang || lang === this.translate.currentLang) {
      return;
    }

    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }
}
