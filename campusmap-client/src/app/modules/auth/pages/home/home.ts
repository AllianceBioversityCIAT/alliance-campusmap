import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HomeMessage } from './components/home-message/home-message';
import { HomeButtonLanguage } from './components/home-button-language/home-button-language';
import { HomeButtonReady } from './components/home-button-ready/home-button-ready';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TranslateModule, HomeMessage, HomeButtonLanguage, HomeButtonReady],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly languageService = inject(LanguageService);

  constructor() {
    // The language is already initialized automatically in the LanguageService
  }
}
