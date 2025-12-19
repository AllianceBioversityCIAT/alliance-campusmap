import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '@shared/services/language.service';

@Component({
  selector: 'app-home-button-ready',
  imports: [CommonModule, RouterModule, ButtonModule, ButtonDirective, TranslateModule],
  templateUrl: './home-button-ready.html',
  styleUrls: ['./home-button-ready.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeButtonReady {
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  language = signal<'en' | 'es'>(this.languageService.getCurrentLanguage());

  constructor() {
    // Subscribe to language changes from LanguageService
    this.languageService.currentLanguage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => {
        this.language.set(lang);
      });
  }

  buttonStyleObj = computed(() => ({
    background:
      this.language() === 'es' ? 'var(--color-primary-green)' : 'var(--color-primary-blue)'
  }));
}
