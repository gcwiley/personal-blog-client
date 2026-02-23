import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// shared components
import { Navbar, Clock, Footer } from '../../../components';

// post components
import { PostDescription, PostDetails } from '../../../posts';

// post service and interface
import { PostService } from '../../../services/post.service';
// import { Post } from '../../../types/post.interface';

@Component({
  selector: 'app-post-details-page',
  templateUrl: './post-details-page.html',
  styleUrl: './post-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, Clock, Footer, PostDescription, PostDetails],
})
export class PostDetailsPage {
  private readonly postService = inject(PostService);
  private readonly router = inject(Router);
}
