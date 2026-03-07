import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { catchError, of } from 'rxjs';

// angular material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// post service and interface
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-recent-posts',
  templateUrl: './recent-posts.html',
  styleUrl: './recent-posts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatListModule, MatIconModule, MatDividerModule],
})
export class RecentPosts {
  private readonly postService = inject(PostService);

  public readonly recentPosts$ = this.postService.getRecentlyCreatedPosts().pipe(
    catchError((error) => {
      console.error('Error getting recent posts:', error);
      return of([])
    })
  )
}
