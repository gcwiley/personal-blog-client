import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

// shared components
import { Navbar, Clock, Footer } from '../../../components';

// post components
import { PostForm, RecentPosts } from '../../../posts';

// can-deactivate guard
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';

@Component({
  selector: 'app-post-form-page',
  templateUrl: './post-form-page.html',
  styleUrl: './post-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, Clock, Footer, PostForm, RecentPosts],
})
export class PostFormPage implements CanComponentDeactivate {
  @ViewChild(PostForm) private postFormComponent!: PostForm;

  public hasUnsavedChanges(): boolean {
    return this.postFormComponent?.hasUnsavedChanges() ?? false;
  }
}
