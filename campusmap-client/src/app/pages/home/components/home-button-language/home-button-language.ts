import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

//Type for allowed languages
type SupportedLang = 'en' | 'es';

@Component({
  selector: 'app-home-button-language',
  imports: [CommonModule, FormsModule, SelectButtonModule, TranslateModule],
  templateUrl: './home-button-language.html',
  styleUrls: ['./home-button-language.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeButtonLanguage {
  //Options shown in the select
  readonly stateOptions = [
    { label: 'English', value: 'en' satisfies SupportedLang },
    { label: 'Español', value: 'es' satisfies SupportedLang }
  ];

  //Current value of the selected language
  value = signal<SupportedLang>('en');

  //Translation service
  private readonly translate = inject(TranslateService);
  //Used to clean subscriptions
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Attempt to load the saved language into localStorage
    const storedLang = (localStorage.getItem('lang') as SupportedLang | null) ?? undefined;
    //Default language. Find the current one, then the fallback or use 'en'
    const defaultLang =
      (this.translate.getCurrentLang() as SupportedLang | undefined) ??
      (this.translate.getFallbackLang() as SupportedLang | undefined) ??
      'en';

    //Defines the initial language. Use saved or default
    this.value.set(storedLang ?? defaultLang);

    //Listen when the language changes from another place
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      this.value.set(event.lang as SupportedLang);
    });
  }

  //Run when the user changes the language from select
  onLanguageChange(lang: SupportedLang) {
    if (!lang || lang === (this.translate.getCurrentLang() as SupportedLang)) {
      return;
    }

    //Save the language and activate it
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }
}
