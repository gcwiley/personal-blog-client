import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// rxjs
import { of, Observable, map, filter, switchMap, catchError } from 'rxjs';

// angular material
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// post and speech service
import { PostService } from '../../services/post.service';
import { SpeechService } from '../../services/speech.service';

// post interface
import { Post } from '../../types/post.interface';

@Component({
  selector: 'app-post-description',
  templateUrl: './post-description.html',
  styleUrl: './post-description.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class PostDescription {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  public readonly speechService = inject(SpeechService);

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
