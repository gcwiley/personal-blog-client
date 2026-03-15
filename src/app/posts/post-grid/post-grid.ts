import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, startWith, switchMap, map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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

  private readonly pageParams$ = new BehaviorSubject({ page: 1, pageSize: 6 });

  public posts$!: Observable<Post[] | null>;
  public hasError = signal(false);
  public totalPosts = signal(0);
  public pageSize = signal(6);

  public ngOnInit(): void {
    this.posts$ = this.pageParams$.pipe(
      switchMap(({ page, pageSize }) =>
        this.postService.getPostsPaginated(page, pageSize).pipe(
          takeUntilDestroyed(this.destroyRef),
          map((res) => {
            this.totalPosts.set(res.total);
            return res.data;
          }),
          startWith(null),
          catchError(() => {
            this.hasError.set(true);
            return of([]);
          }),
        ),
      ),
    );
  }

  public onPageChange(event: PageEvent): void {
    this.hasError.set(false); // reset before next request
    this.pageSize.set(event.pageSize);
    this.pageParams$.next({ page: event.pageIndex + 1, pageSize: event.pageSize });
  }
}
