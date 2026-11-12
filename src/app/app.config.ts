import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { NJ_CONFIG } from './core/config';
import { provideNjAuth } from './core/auth/auth.providers';
import { authTokenInterceptor } from './core/auth/auth.interceptor';
import { mockApiInterceptor } from './core/mock/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    { provide: NJ_CONFIG, useValue: environment },
    // Order matters: the token is added first, so the mock can check it like the real API.
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor, mockApiInterceptor])),
    provideNjAuth(environment),
  ],
};
