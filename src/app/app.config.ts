import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideQuillConfig } from 'ngx-quill';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';

// configures Angular's HttpClient service to be available for injection.
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// auth interceptor and service
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';

// routes
import { routes } from './app.routes';

// Application configuration for the Angular app
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideQuillConfig({}),
    // hydrates AuthService's session signal (from the httpOnly session cookie, via
    // OAuth2 Proxy's forwarded headers) before the first route activates, so the
    // auth guard's synchronous signal check is accurate on the very first navigation
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(
        authService.exchangeGoogleSession().pipe(catchError(() => of(null))),
      );
    }),
  ],
};
