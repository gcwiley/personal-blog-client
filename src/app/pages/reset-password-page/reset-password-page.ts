import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';

// angular material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

// auth service
import { AuthService } from '../../services/auth.service';

// constants
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

function passwordsMatchValidator(
  group: AbstractControl,
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}

const ERROR_MESSAGES = {
  INVALID_TOKEN: 'This password reset link is invalid or has expired.',
  NETWORK_ERROR: 'A network error occurred. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class ResetPasswordPage implements OnInit {
  public readonly isLoading = signal(false);
  public readonly submitted = signal(false);
  public readonly tokenMissing = signal(false);
  public readonly showPassword = signal(false);
  public readonly showConfirm = signal(false);
  public readonly year = new Date().getFullYear();

  private token = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  public readonly resetPasswordForm: FormGroup = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator },
  );

  public ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.tokenMissing.set(true);
    } else {
      this.token = token;
    }
  }

  public onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.token) return;

    this.isLoading.set(true);
    const { password } = this.resetPasswordForm.value;

    this.authService
      .resetPassword(this.token, password)
      .pipe(
        catchError((error) => {
          const message =
            error.status === 0
              ? ERROR_MESSAGES.NETWORK_ERROR
              : error.status === 400
                ? ERROR_MESSAGES.INVALID_TOKEN
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
        if (response !== null) {
          this.submitted.set(true);
        }
      });
  }
}
