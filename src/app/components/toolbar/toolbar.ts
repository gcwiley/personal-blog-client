import {
  ChangeDetectionStrategy,
  Component,
  model,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

// angular material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SortDirection } from '@angular/material/sort';

// post and theme service
import { PostService } from '../../services/post.service';
import { ThemeService } from '../../services/theme.service';

export type PostViewMode = 'grid' | 'table';
export type PostSortField = 'createdAt' | 'title' | 'date';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
})
export class Toolbar {
  private readonly postService = inject(PostService);
  private readonly themeService = inject(ThemeService);
  public readonly isDark = toSignal(this.themeService.isDark$, { initialValue: false });

  public viewMode = model<PostViewMode>('grid');
  public sortField = model<PostSortField>('createdAt');
  public sortOrder = model<SortDirection>('desc');

  // get post count
  public readonly postCount$ = this.postService.getPostsCount().pipe(
    catchError(() => of(null)), // null signals a fetch failure gracefully
  );

  // toggle theme
  public toggleTheme(): void {
    this.themeService.toggleTheme()
  }
}
