import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../shared/services/language.service';

import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-message',
  imports: [CommonModule, TranslateModule],
  templateUrl: './home-message.html',
  styleUrls: ['./home-message.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeMessage {
  private readonly languageService = inject(LanguageService);

  // Signal for the current language based on service observable
  private readonly currentLanguage = toSignal(this.languageService.currentLanguage$, {
    initialValue: this.languageService.getCurrentLanguage()
  });

  // Derived signal: true when Spanish is selected
  readonly isSpanish = computed(() => this.currentLanguage() === 'es');
}
