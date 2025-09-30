import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

// ngx-translate v17 (standalone)
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),

    // ✅ Importante: habilitamos HttpClient
    provideHttpClient(withInterceptorsFromDi()),

    // Proveedor de i18n (v17): configuramos loader y fallbackLang
    TranslateService,
    provideTranslateService({
      // idioma fallback (se usa cuando no hay traducción o al iniciar)
      fallbackLang: 'en',

      // configurar el http loader (prefijo/sufijo, caché, bypass interceptors, etc.)
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
        // opcionales:
        // enforceLoading: true,
        // useHttpBackend: true
      })
    }),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                  darkModeSelector: ''
                }
            }
        })
  ]
};
