import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

// shared components
import { Navbar, Footer, Clock } from '../../components';

// auth service
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.html',
  styleUrl: './user-profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Navbar,
    Footer,
    Clock,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
  ],
})
export class UserProfilePage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly userEmail = toSignal(this.authService.userEmail$);
  public readonly username = toSignal(this.authService.username$);
  public readonly isAuthenticated = toSignal(this.authService.isAuthenticated$);

  public signOut(): void {
    this.authService.signOutUser();
    this.router.navigateByUrl('/signin');
  }
}
