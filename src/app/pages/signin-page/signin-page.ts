import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

// material components
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// auth service
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin-page.html',
  styleUrl: './signin-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class SignInPage implements OnInit {
  // signals work correctly with OnPush
  public readonly isLoading = signal(true);
  public readonly year = new Date().getFullYear();

  // inject dependencies
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    // by the time this page loads, the browser already carries OAuth2 Proxy's
    // Google-authenticated session cookie — silently try to exchange it for an app
    // session before showing a manual "Sign in with Google" button.
    this.authService
      .exchangeGoogleSession()
      .pipe(
        catchError(() => of(null)),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((response) => {
        if (response) {
          this.router.navigateByUrl(this.getReturnUrl());
        }
      });
  }

  public onSignInWithGoogle(): void {
    this.authService.signInWithGoogle(this.getReturnUrl());
  }

  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const isSafeUrl = !!returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//');
    return isSafeUrl ? returnUrl : '/';
  }
}
