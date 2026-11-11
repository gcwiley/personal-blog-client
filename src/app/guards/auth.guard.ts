import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// auth service
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // isAuthenticated is a signal, so this is a plain synchronous check — the
  // session is hydrated once up front via provideAppInitializer (see app.config.ts)
  if (authService.isAuthenticated()) {
    return true;
  }

  // only allow relative paths to prevent open redirect attacks
  const returnUrl = state.url;
  const isSafeUrl = returnUrl.startsWith('/') && !returnUrl.startsWith('//');

  // redirect to the sign-in page if not authenticated
  return router.createUrlTree(['/signin'], {
    queryParams: { returnUrl: isSafeUrl ? returnUrl : '/' },
  });
};
