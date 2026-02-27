import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  private http = inject(HttpClient);

  public signInUser(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.authStatus.next(true);
      })
    );
  }

  public register(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/register', { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.authStatus.next(true);
      })
    );
  }

  public signOutUser(): void {
    this.removeToken();
    this.authStatus.next(false);
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
}