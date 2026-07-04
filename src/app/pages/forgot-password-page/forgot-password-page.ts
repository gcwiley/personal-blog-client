import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// auth service
import { AuthService } from '../../services/auth.service';

// constants
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

const ERROR_MESSAGES = {
  NETWORK_ERROR: 'A network error occurred. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class ForgotPasswordPage {
  public readonly isLoading = signal(false);
  public readonly submitted = signal(false);
  public readonly year = new Date().getFullYear();

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  public readonly forgotPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public onSubmit(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading.set(true);
    const { email } = this.forgotPasswordForm.value;

    this.authService
      .forgotPassword(email)
      .pipe(
        catchError((error) => {
          const message =
            error.status === 0
              ? ERROR_MESSAGES.NETWORK_ERROR
              : ERROR_MESSAGES.UNKNOWN_ERROR;

          this.snackBar.open(message, 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        // response is void on success; null means an error was caught
        if (response !== null) {
          this.submitted.set(true);
        }
      });
  }
}
