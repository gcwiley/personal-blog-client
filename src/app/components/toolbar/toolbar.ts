import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

// rxjs 
import { catchError, debounceTime, of, Subject } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

// angular material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
})
export class Toolbar {
  private readonly postService = inject(PostService);
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly isDark = toSignal(this.themeService.isDark$, {
    initialValue: false,
  });

  public viewMode = model<PostViewMode>('grid');
  public sortField = model<PostSortField>('createdAt');
  public sortOrder = model<SortDirection>('desc');
  public searchQuery = model<string>('');

  private readonly searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => this.searchQuery.set(q));
  }

  // get post count as a signal, with error handling to return null on failure
  public readonly postCount$ = this.postService.getPostsCount().pipe(
    catchError(() => of(null)), // null signals a fetch failure gracefully
  );

  // toggle theme between light and dark
  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public onSearch(value: string): void {
    this.searchInput$.next(value);
  }

  public clearSearch(): void {
    this.searchQuery.set('');
  }
}
