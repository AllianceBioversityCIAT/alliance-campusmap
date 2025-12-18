import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '@shared/services/language.service';

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

  //Services
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  //Current value of the selected language
  value = signal<SupportedLang>(this.languageService.getCurrentLanguage());

  //Computed color based on selected language
  selectedLanguageClass = computed(() => (this.value() === 'es' ? 'lang-spanish' : 'lang-english'));

  constructor() {
    //Listen when the language changes from another place
    this.languageService.currentLanguage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => {
        this.value.set(lang as SupportedLang);
      });
  }

  //Run when the user changes the language from select
  onLanguageChange(lang: SupportedLang) {
    if (!lang || lang === this.languageService.getCurrentLanguage()) {
      return;
    }

    //Use LanguageService to set language (it handles TranslateService and localStorage)
    this.languageService.setLanguage(lang);
  }
}
