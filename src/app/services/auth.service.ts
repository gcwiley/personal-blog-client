import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';

// utils for checking token expiration and decoding JWT payload
import { decodeJwt, isTokenExpired } from '../utils/jwt.utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'my_blog_jwt_token';
  private readonly USERNAME_KEY = 'my_blog_username';

  private readonly authStatus = new BehaviorSubject<boolean>(
    this.hasValidToken(),
  );

  private readonly http = inject(HttpClient);

  // BehaviorSubject to hold the current user information
  private readonly currentUser = new BehaviorSubject<{
    email: string;
    username: string;
  } | null>(this.getUserFromToken());

  private getUserFromToken(): { email: string; username: string } | null {
    const token = this.getToken();
    if (!token || isTokenExpired(token)) return null;
    const payload = decodeJwt(token);
    const email = payload?.['email'];
    const username =
      payload?.['username'] ?? localStorage.getItem(this.USERNAME_KEY);
    return typeof email === 'string'
      ? { email, username: typeof username === 'string' ? username : '' }
      : null;
  }

  // Observable to expose the current user information
  public readonly userEmail$ = this.currentUser.pipe(
    map((user) => user?.email ?? null),
  );

  public readonly username$ = this.currentUser.pipe(
    map((user) => user?.username ?? null),
  );

  // SIGN IN USER
  public signInUser(
    username: string,
    password: string,
  ): Observable<{ token: string; user: { email: string; username: string } }> {
    return this.http
      .post<{
        token: string;
        user: { email: string; username: string };
      }>('/api/auth/signin', { username, password })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          localStorage.setItem(this.USERNAME_KEY, response.user.username);
          this.authStatus.next(true);
          this.currentUser.next(response.user);
        }),
      );
  }

  // REGISTER NEW USER
  public registerNewUser(
    username: string,
    email: string,
    password: string,
  ): Observable<{ token: string; user: { email: string; username: string } }> {
    return this.http
      .post<{
        token: string;
        user: { email: string; username: string };
      }>('/api/auth/register', { username, email, password })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          localStorage.setItem(this.USERNAME_KEY, response.user.username);
          this.authStatus.next(true);
          this.currentUser.next(response.user);
        }),
      );
  }

  // FORGOT PASSWORD
  public forgotPassword(email: string): Observable<void> {
    return this.http.post<void>('/api/auth/forgot-password', { email });
  }

  // RESET PASSWORD
  public resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>('/api/auth/reset-password', {
      token,
      password,
    });
  }

  // SIGN OUT USER
  public signOutUser(): void {
    this.removeToken();
    localStorage.removeItem(this.USERNAME_KEY);
    this.authStatus.next(false);
    this.currentUser.next(null);
  }

  // Observable to expose the authentication status
  readonly isAuthenticated$ = this.authStatus.asObservable();

  // Store the token in local storage
  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Remove the token from local storage
  private removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Retrieve the token from local storage
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if the token is expired
  private isTokenExpired(): boolean {
    const token = this.getToken();
    return !token || isTokenExpired(token);
  }

  // Check if the token is valid (exists and not expired)
  private hasValidToken(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
