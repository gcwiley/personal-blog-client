import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// material components
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

// post interface
import { Post } from '../../types/post.interface';

@Component({
  selector: 'app-recent-posts',
  templateUrl: './recent-posts.html',
  styleUrl: './recent-posts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
})
export class RecentPosts {
  public readonly recentPosts = input.required<Post[]>();
}
