import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

// ngx-translate v17 (standalone)
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    //Global browser error handling
    provideBrowserGlobalErrorListeners(),
    //Optimize performance by grouping DOM events
    provideZoneChangeDetection({ eventCoalescing: true }),
    //App routing
    provideRouter(routes),
    //Animations support for PrimeNG
    provideAnimations(),

    //HTTP client with support for interceptors
    provideHttpClient(withInterceptorsFromDi()),

    //Main translation service
    TranslateService,

    //Initial configuration of ngx-translate
    provideTranslateService({
      // Default language if the requested one does not exist
      fallbackLang: 'en',

      //Loader that obtains JSON files from /assets/i18n/
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    }),
    //PrimeNG global configuration
    providePrimeNG()
  ]
};
