import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// rxjs
import { map, take } from 'rxjs';

// auth service
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      // only allow relative paths to prevent open redirect attacks
      const returnUrl = state.url;
      const isSafeUrl =
        returnUrl.startsWith('/') && !returnUrl.startsWith('//');

      // redirect to the sign-in page if not authenticated
      return router.createUrlTree(['/signin'], {
        queryParams: { returnUrl: isSafeUrl ? returnUrl : '/' },
      });
    }),
  );
};
