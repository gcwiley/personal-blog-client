import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// material components
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

  // auth service already exposes these as signals
  public readonly userEmail = this.authService.userEmail;
  public readonly username = this.authService.username;
  public readonly isAuthenticated = this.authService.isAuthenticated;

  // sign out the currently authenticated user — AuthService handles navigation
  // back to /signin once the server-side session cookie has been cleared
  public signOut(): void {
    this.authService.signOutUser();
  }
}
