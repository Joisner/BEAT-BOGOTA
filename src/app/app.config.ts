import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

// 👇 Importamos y registramos el locale español
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { errorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor])
    ),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    }),

    // 👇 Esto hace que Angular use "es" por defecto en DatePipe
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};
