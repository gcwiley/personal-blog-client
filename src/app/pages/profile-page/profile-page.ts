import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { Navbar, Footer, Clock } from '../../components';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
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
export class ProfilePage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly userEmail = toSignal(this.authService.userEmail$);
  public readonly isAuthenticated = toSignal(this.authService.isAuthenticated$);

  public signOut(): void {
    this.authService.signOutUser();
    this.router.navigateByUrl('/signin');
  }
}
