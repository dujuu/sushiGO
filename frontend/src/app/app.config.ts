import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { API_BASE_URL } from './core/config/app.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideClientHydration(withEventReplay()),
    {
      provide: API_BASE_URL,
      useValue: 'http://localhost/api/v1',
    },
  ]
};
