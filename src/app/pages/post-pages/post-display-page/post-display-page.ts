import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';

// shared components
import { Navbar, Clock, Footer, Toolbar } from '../../../components';

// post components
import { PostGrid, PostTable } from '../../../posts';

@Component({
  selector: 'app-post-display-page',
  templateUrl: './post-display-page.html',
  styleUrl: './post-display-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, Clock, Footer, Toolbar, PostGrid, PostTable],
})
export class PostDisplayPage {
  public currentView = signal<'grid' | 'table'>('grid');
}
