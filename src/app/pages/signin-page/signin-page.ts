import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// auth service
import { AuthService } from '../../services/auth.service';

// constants
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password.',
  NETWORK_ERROR: 'A network error occurred. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

@Component({
  selector: 'app-signin',
  templateUrl: './signin-page.html',
  styleUrl: './signin-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class SignInPage {
  // signals work correctly with OnPush
  public readonly isLoading = signal(false);
  public readonly showPassword = signal(false);
  public readonly year = new Date().getFullYear();

  // inject dependencies
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // initialized inline - no need for OnInit
  public readonly signinForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }

  public onSubmitSignIn(): void {
    if (this.signinForm.invalid) return;

    this.isLoading.set(true);
    const { username, password } = this.signinForm.value;

    this.authService
      .signInUser(username, password)
      .pipe(
        catchError((error) => {
          const message =
            error.status === 401
              ? ERROR_MESSAGES.INVALID_CREDENTIALS
              : error.status === 0
                ? ERROR_MESSAGES.NETWORK_ERROR
                : ERROR_MESSAGES.UNKNOWN_ERROR;

          this.snackBar.open(message, 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((response) => {
        if (response) {
          this.router.navigateByUrl('/');
        }
      });
  }
}
