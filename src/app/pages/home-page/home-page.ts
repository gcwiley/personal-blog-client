import { Component } from '@angular/core';

// shared components
import {
  Navbar,
  Clock,
  Calendar,
  Hero,
  Toolbar,
  Footer,
} from '../../components/index';

// post components
import { PostGrid, RecentPosts } from '../../posts';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [
    Navbar,
    Calendar,
    Clock,
    Toolbar,
    Footer,
    Hero,
    PostGrid,
    RecentPosts,
  ],
})
export class Homepage {
  public searchQuery = '';
}
