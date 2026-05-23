import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { catchError, throwError } from 'rxjs';

// auth service
import { AuthService } from '../services/auth.service';

// environment variables
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // only add the Authorization header for API requests
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  if (!isApiRequest) {
    return next(req);
  }

  // get the token from the auth service and add it to the request headers if it exists
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  // handle 401 Unauthorized errors by signing out the user and redirecting to the sign-in page
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // sign out the user and redirect to the sign-in page
        authService.signOutUser();
        router.navigate(['/signin']);
      }
      return throwError(() => error);
    }),
  );
};
