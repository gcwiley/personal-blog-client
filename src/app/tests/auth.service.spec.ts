import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

// auth service
import { AuthService } from '../services/auth.service';

// environment variables
import { environment } from '../../environments/environment';

const MOCK_USER = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
};

const SESSION_URL = `${environment.apiUrl}/auth/session`;
const SIGNOUT_URL = `${environment.apiUrl}/auth/signout`;

// --- suite ---

describe('AuthService', () => {
  let httpTesting: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'signin', children: [] }]),
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  // --- initialization ---

  describe('initialization', () => {
    it('is unauthenticated before any session is established', () => {
      const service = TestBed.inject(AuthService);
      expect(service.isAuthenticated()).toBe(false);
      expect(service.userEmail()).toBeNull();
      expect(service.username()).toBeNull();
    });
  });

  // --- exchangeGoogleSession ---

  describe('exchangeGoogleSession()', () => {
    it('POSTs to /auth/session with credentials included (so the httpOnly session cookie is sent/received)', () => {
      const service = TestBed.inject(AuthService);
      service.exchangeGoogleSession().subscribe();

      const req = httpTesting.expectOne(SESSION_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      req.flush({
        success: true,
        message: 'Session established.',
        user: MOCK_USER,
      });
    });

    it('never reads or stores a JWT client-side — only user info is tracked', () => {
      const service = TestBed.inject(AuthService);
      service.exchangeGoogleSession().subscribe();

      httpTesting.expectOne(SESSION_URL).flush({
        success: true,
        message: 'Session established.',
        user: MOCK_USER,
      });

      expect(service.user()).toEqual(MOCK_USER);
    });

    it('sets isAuthenticated() to true after a successful exchange', () => {
      const service = TestBed.inject(AuthService);
      service.exchangeGoogleSession().subscribe();

      httpTesting.expectOne(SESSION_URL).flush({
        success: true,
        message: 'Session established.',
        user: MOCK_USER,
      });

      expect(service.isAuthenticated()).toBe(true);
      expect(service.userEmail()).toBe(MOCK_USER.email);
      expect(service.username()).toBe(MOCK_USER.username);
    });

    it('propagates an error and leaves the session unauthenticated when the proxy session is missing', () => {
      const service = TestBed.inject(AuthService);
      let error: unknown;
      service.exchangeGoogleSession().subscribe({
        error: (e) => (error = e),
      });

      httpTesting
        .expectOne(SESSION_URL)
        .flush(
          { success: false, message: 'No authenticated session found.' },
          { status: 401, statusText: 'Unauthorized' },
        );

      expect(error).toBeDefined();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  // --- signOutUser ---

  describe('signOutUser()', () => {
    it('POSTs to /auth/signout with credentials included', () => {
      const service = TestBed.inject(AuthService);
      service.signOutUser();

      const req = httpTesting.expectOne(SIGNOUT_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      req.flush({ success: true, message: 'Signed out successfully.' });
    });

    it('clears the session and navigates to /signin on success', () => {
      const service = TestBed.inject(AuthService);
      const navigateSpy = vi.spyOn(router, 'navigate');

      service.signOutUser();
      httpTesting
        .expectOne(SIGNOUT_URL)
        .flush({ success: true, message: 'Signed out successfully.' });

      expect(service.isAuthenticated()).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/signin']);
    });

    it('still clears the local session and navigates even if the request fails', () => {
      const service = TestBed.inject(AuthService);
      const navigateSpy = vi.spyOn(router, 'navigate');

      service.signOutUser();
      httpTesting
        .expectOne(SIGNOUT_URL)
        .flush(null, { status: 500, statusText: 'Server Error' });

      expect(service.isAuthenticated()).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/signin']);
    });
  });
});
