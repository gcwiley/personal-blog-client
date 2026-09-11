import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

// rxjs
import { Observable } from 'rxjs';

// material components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

// contact component
import { Contact } from '../contact/contact';

// auth service and theme services
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

// constants
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
  ],
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  public readonly isDark$ = this.themeService.isDark$;

  public readonly isAuthenticated$: Observable<boolean> =
    this.authService.isAuthenticated$;

  // declared to match navbar.html usage
  public readonly userEmail$: Observable<string | null> =
    this.authService.userEmail$;

  // open user feedback dialog
  public openFeedbackDialog(): void {
    this.dialog.open(Contact, { width: '480px' });
  }

  // toggle theme between light and dark
  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // sign out current user
  public onClickSignOut(): void {
    try {
      this.authService.signOutUser();
      this.snackBar.open('You have successfully signed out.', 'Close', {
        duration: SNACK_BAR_DURATION_MS,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      this.snackBar.open('Error signing out. Please try again.', 'Close', {
        duration: SNACK_BAR_DURATION_MS,
      });
    }
  }
}
