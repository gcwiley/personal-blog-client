import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

// shared components
import { Navbar, Clock, Footer, Toolbar } from '../../../components';

// post components
import { PostGrid, PostTable } from '../../../posts';

// import post service and interface
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post-grid-page',
  templateUrl: './post-grid-page.html',
  styleUrl: './post-grid-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, Clock, Footer, Toolbar, PostGrid, PostTable],
})
export class PostGridPage {
  public currentView = signal<'grid' | 'table'>('grid');

  private readonly postService = inject(PostService);
  private readonly router = inject(Router);
}
