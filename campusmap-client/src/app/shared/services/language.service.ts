import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SupportedLanguage = 'en' | 'es';

/**
 * Centralized service to manage the application's language.
 * Handles language switching and persists user preference in localStorage.
 *
 * @example
 * // Inject the service
 * private languageService = inject(LanguageService);
 *
 * // Change language
 * this.languageService.setLanguage('en');
 *
 * // Get current language
 * const current = this.languageService.getCurrentLanguage();
 *
 * // Toggle language
 * this.languageService.toggleLanguage();
 *
 * // Translate in code
 * const text = this.languageService.instant('Home.title');
 *
 * @see docs/I18N_GUIDE.md for full documentation
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly STORAGE_KEY = 'lang';
  private readonly DEFAULT_LANG: SupportedLanguage = 'es';

  private readonly currentLanguageSubject = new BehaviorSubject<SupportedLanguage>(
    this.DEFAULT_LANG
  );
  public currentLanguage$: Observable<SupportedLanguage> =
    this.currentLanguageSubject.asObservable();

  constructor() {
    this.initializeLanguage();
  }

  /**
   * Initializes the language from localStorage or uses the default one
   */
  private initializeLanguage(): void {
    const savedLang = this.getSavedLanguage();
    this.translate.addLangs(['en', 'es']);
    this.setLanguage(savedLang);
  }

  /**
   * Gets the saved language from localStorage
   */
  private getSavedLanguage(): SupportedLanguage {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === 'en' || stored === 'es' ? stored : this.DEFAULT_LANG;
  }

  /**
   * Changes the application language
   * @param lang - Language to set ('en' or 'es')
   */
  public setLanguage(lang: SupportedLanguage): void {
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.currentLanguageSubject.next(lang);
  }

  /**
   * Gets the current language
   */
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  /**
   * Toggles between English and Spanish
   */
  public toggleLanguage(): void {
    const newLang: SupportedLanguage = this.getCurrentLanguage() === 'en' ? 'es' : 'en';
    this.setLanguage(newLang);
  }

  /**
   * Translates a key instantly
   * @param key - Translation key (e.g., 'Home.title')
   * @param params - Optional parameters for interpolation
   */
  public instant(key: string, params?: object): string {
    return this.translate.instant(key, params);
  }

  /**
   * Translates a key asynchronously (returns an Observable)
   * @param key - Translation key
   * @param params - Optional parameters for interpolation
   */
  public get(key: string, params?: object): Observable<string> {
    return this.translate.get(key, params);
  }
}
