import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  private readonly http = inject(HttpClient);

  private readonly currentUser = new BehaviorSubject<{ email: string } | null>(
    null,
  );
  public readonly userEmail$ = this.currentUser.pipe(
    map((user) => user?.email ?? null),
  );

  // SIGN IN USER
  public signInUser(
    username: string,
    password: string,
  ): Observable<{ token: string; user: { email: string } }> {
    return this.http
      .post<{
        token: string;
        user: { email: string };
      }>('/api/auth/signin', { username, password })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
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
  ): Observable<{ token: string }> {
    return this.http
      .post<{
        token: string;
      }>('/api/auth/register', { username, email, password })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.authStatus.next(true);
        }),
      );
  }

  // SIGN OUT USER
  public signOutUser(): void {
    this.removeToken();
    this.authStatus.next(false);
    this.currentUser.next(null);
  }

  isAuthenticated$ = this.authStatus.asObservable();

  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true; // malformed - treat as expired
    }
  }

  private hasValidToken(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
