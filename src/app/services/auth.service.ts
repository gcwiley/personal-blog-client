import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, finalize, map } from 'rxjs';

// environment variables
import { environment } from '../../environments/environment';

interface SessionUser {
  id: string;
  username: string;
  email: string;
}

export interface SessionResponse {
  success: boolean;
  message: string;
  user: SessionUser;
}

// Google SSO is handled entirely by OAuth2 Proxy, which sits in front of the whole
// app. This service never collects (or sees) a password or a raw JWT — the app
// session lives only in a server-set httpOnly cookie, so it can never be read or
// exfiltrated by client-side JavaScript (e.g. via XSS). This service only tracks
// *who* is signed in (for the UI) and hands off to OAuth2 Proxy's own routes to
// start/end the underlying Google session.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // source of truth for the current session — null means signed out. Nothing here
  // is persisted client-side; it's rehydrated via exchangeGoogleSession() on app
  // bootstrap (see provideAppInitializer in app.config.ts).
  private readonly currentUser = signal<SessionUser | null>(null);

  public readonly user = this.currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => this.currentUser() !== null);
  public readonly userEmail = computed(() => this.currentUser()?.email ?? null);
  public readonly username = computed(() => this.currentUser()?.username ?? null);

  // Exchanges the OAuth2 Proxy-authenticated session for an app session cookie.
  // Must be called with credentials so the proxy's session cookie travels along
  // with the request, and so the server's Set-Cookie response is honored. Only
  // succeeds if the request actually passed through OAuth2 Proxy (i.e. the browser
  // already has a valid Google-backed session).
  public exchangeGoogleSession(): Observable<SessionResponse> {
    return this.http
      .post<SessionResponse>(
        `${environment.apiUrl}/auth/session`,
        {},
        { withCredentials: true },
      )
      .pipe(
        map((response) => {
          this.currentUser.set(response.user);
          return response;
        }),
      );
  }

  // Starts the Google sign-in flow. This must be a full page navigation (not an XHR)
  // so the browser can follow OAuth2 Proxy's redirect to Google's cross-origin login.
  public signInWithGoogle(returnUrl = '/'): void {
    window.location.href = `/oauth2/sign_in?rd=${encodeURIComponent(returnUrl)}`;
  }

  // Clears the server-side session cookie, then the local signal, then navigates to
  // the sign-in page. Ending the OAuth2 Proxy/Google session itself happens via a
  // link to /oauth2/sign_out.
  public signOutUser(): void {
    this.http
      .post(`${environment.apiUrl}/auth/signout`, {}, { withCredentials: true })
      .pipe(
        finalize(() => {
          // clear local state regardless of whether the request succeeded — a
          // network error shouldn't block the user from being signed out locally
          this.currentUser.set(null);
          this.router.navigate(['/signin']);
        }),
      )
      .subscribe({ error: () => undefined });
  }
}
