import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// rxjs
import { of, Observable, map, filter, switchMap, catchError } from 'rxjs';

// angular material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

// post service and interface
import { PostService } from '../../services/post.service';
import { Post } from '../../types/post.interface';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
})
export class PostDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);

  public post$: Observable<Post | undefined> = this.route.paramMap.pipe(
    map((pm) => pm.get('id')),
    filter((id): id is string => !!id),
    switchMap((id) =>
      this.postService.getPostById(id).pipe(
        catchError((error) => {
          console.error('Error fetching post:', error);
          return of(undefined);
        }),
      ),
    ),
  );
}
