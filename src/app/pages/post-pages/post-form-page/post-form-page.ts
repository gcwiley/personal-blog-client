import { ChangeDetectionStrategy, Component } from '@angular/core';

// shared components
import { Navbar, Clock, Footer } from '../../../components';

// post components
import { PostForm, RecentPosts } from '../../../posts';

@Component({
  selector: 'app-post-form-page',
  templateUrl: './post-form-page.html',
  styleUrl: './post-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Navbar,
    Clock,
    Footer,
    PostForm,
    RecentPosts,
  ],
})
export class PostFormPage {}
