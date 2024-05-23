import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideTranslations } from './translation.providers';
import { LIBRARY_CONFIG } from 'authentication_frontend_library';
import { authInterceptor } from './services/interceptor/auth.interceptor';

// Create a loader for translation files
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideTranslations(),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LIBRARY_CONFIG, useFactory: configFactory, deps: [HttpClient] }
  ],
};
export function configFactory(http: HttpClient): any {
  return http.get('assets/library.config.json');
}
