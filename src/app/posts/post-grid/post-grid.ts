import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

// rxjs
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import {
  catchError,
  map,
  skip,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

// post service, interface, pipes
import { PostService } from '../../services/post.service';
import { Post } from '../../types/post.interface';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-post-grid',
  templateUrl: './post-grid.html',
  styleUrl: './post-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DatePipe,
    TimeAgoPipe,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
})
export class PostGrid implements OnInit {
  private readonly postService = inject(PostService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly searchQuery = input<string>('');
  private readonly searchQuery$ = toObservable(this.searchQuery);

  private readonly pageParams$ = new BehaviorSubject({ page: 1, pageSize: 6 });

  public posts$!: Observable<Post[] | null>;
  public hasError = signal(false);
  public totalPosts = signal(0);
  public pageSize = signal(6);

  public ngOnInit(): void {
    // Reset to page 1 whenever the search query changes
    this.searchQuery$
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() =>
        this.pageParams$.next({ page: 1, pageSize: this.pageSize() }),
      );

    this.posts$ = combineLatest([this.pageParams$, this.searchQuery$]).pipe(
      switchMap(([{ page, pageSize }, query]) => {
        const source$ = query.trim()
          ? this.postService
              .searchPosts(query)
              .pipe(tap((results) => this.totalPosts.set(results.length)))
          : this.postService.getPosts(page, pageSize).pipe(
              map((res) => {
                this.totalPosts.set(res.total);
                return res.data;
              }),
            );

        return source$.pipe(
          takeUntilDestroyed(this.destroyRef),
          startWith(null),
          catchError(() => {
            this.hasError.set(true);
            return of([]);
          }),
        );
      }),
    );
  }

  public onPageChange(event: PageEvent): void {
    this.hasError.set(false);
    this.pageSize.set(event.pageSize);
    this.pageParams$.next({
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }
}
