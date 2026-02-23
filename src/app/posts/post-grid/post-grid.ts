import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { RouterModule } from '@angular/router';

// rxjs
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// post service and interface
import { PostService } from '../../services/post.service';
import { Post } from '../../types/post.interface';

@Component({
  selector: 'app-post-grid',
  templateUrl: './post-grid.html',
  styleUrl: './post-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class PostGrid implements OnInit {
  private readonly postService = inject(PostService);
  private readonly destroyRef = inject(DestroyRef);

  // observable streams
  public posts$!: Observable<Post[] | null>;
  public hasError = signal(false);

  public ngOnInit(): void {
    this.posts$ = this.postService.getPosts().pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(null),
      catchError(() => {
        this.hasError.set(true);
        return of([]);
      }),
    );
  }
}
